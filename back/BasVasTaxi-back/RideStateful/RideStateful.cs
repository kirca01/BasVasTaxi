using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ClassCommon.DTOs;
using ClassCommon.Enums;
using ClassCommon.Interfaces;
using ClassCommon.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;

namespace RideStateful
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    internal sealed class RideStateful : StatefulService, IRideStateful
    {
        private RideDBContext _rideDbContext;
        public RideStateful(StatefulServiceContext context, IServiceProvider serviceProvider)
            : base(context)
        {
            _rideDbContext = serviceProvider.GetService<RideDBContext>();
        }

        public async Task AcceptRide(Guid rideId, Guid driverId)
        {
            var stateManager = this.StateManager;
            var ridesDict = await stateManager.GetOrAddAsync<IReliableDictionary<Guid, Ride>>("rideDictionary");

            using (var transaction = stateManager.CreateTransaction())
            {
                var ride = await GetRideById(rideId) ?? throw new InvalidOperationException();

                if (ride.Status != RideStatus.PENDING)
                {
                    throw new InvalidOperationException("Ride is already accepted or finished.");
                }

                ride.Status = RideStatus.CONFIRMED;
                ride.DriverId = driverId;

                await ridesDict.AddOrUpdateAsync(transaction, rideId, ride, (k, v) => ride);
                await transaction.CommitAsync();
            }

            var rideFromDb = await _rideDbContext.Rides.FindAsync(rideId);
            if (rideFromDb != null)
            {
                
                rideFromDb.Status = RideStatus.CONFIRMED;
                rideFromDb.DriverId = driverId;
                await _rideDbContext.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException($"Ride with ID {rideId} not found in the database.");
            }
        }

        private async Task<Ride> GetRideById(Guid id)
        {
            var stateManager = this.StateManager;
            var usersDict = await stateManager.GetOrAddAsync<IReliableDictionary<Guid, Ride>>("rideDictionary");

            using (var transaction = stateManager.CreateTransaction())
            {
                var enumerator = (await usersDict.CreateEnumerableAsync(transaction)).GetAsyncEnumerator();

                while (await enumerator.MoveNextAsync(default))
                {
                    var rideDict = enumerator.Current.Value;
                    if (rideDict != null && rideDict.Id == id)
                    {
                        return rideDict;
                    }
                }
            }
            return null;
        }

        public async Task<RideDTO> CreateRide(CreateRideDTO dto)
        {
            Ride ride = new Ride();
            ride.StartAddress = dto.StartAddress;
            ride.EndAddress = dto.EndAddress;
            ride.UserId = dto.UserID;
            ride.Status = RideStatus.PENDING;
            Random random = new Random();
            int price = random.Next(200, 701);
            ride.Price = price;
            int travelTime = random.Next(5, 21);
            ride.TravelTime = travelTime;
            int waitTime = random.Next(2, 6);
            ride.WaitTime = waitTime;

            var stateMenager = this.StateManager;
            var rideDictionary = await stateMenager.GetOrAddAsync<IReliableDictionary<Guid, Ride>>("rideDictionary");

            using (var transaction = stateMenager.CreateTransaction())
            {
                await rideDictionary.AddOrUpdateAsync(transaction, ride.Id, ride, (k, v) => v);
                await transaction.CommitAsync();
            }
            await _rideDbContext.Rides.AddAsync(ride);
            await _rideDbContext.SaveChangesAsync();
            return new RideDTO(ride);
        }

        public async Task DeleteRide(Guid rideId)
        {
            var stateManager = this.StateManager;
            var ridesDict = await stateManager.GetOrAddAsync<IReliableDictionary<Guid, Ride>>("rideDictionary");

            using (var transaction = stateManager.CreateTransaction())
            {
                var rideExists = await ridesDict.TryGetValueAsync(transaction, rideId);
                if (rideExists.HasValue)
                {
                    await ridesDict.TryRemoveAsync(transaction, rideId); 
                    await transaction.CommitAsync();
                }
                else
                {
                    throw new InvalidOperationException($"Ride with ID {rideId} not found in Service Fabric.");
                }
            }

            
            var rideFromDb = await _rideDbContext.Rides.FindAsync(rideId);
            if (rideFromDb != null)
            {
                _rideDbContext.Rides.Remove(rideFromDb);
                await _rideDbContext.SaveChangesAsync(); 
            }
            else
            {
                throw new InvalidOperationException($"Ride with ID {rideId} not found in the database.");
            }
        }

        public async Task<List<RideDTO>> GetAllPendingRides()
        {
            var stateManager = this.StateManager;
            var ridesDict = await stateManager.GetOrAddAsync<IReliableDictionary<Guid, Ride>>("rideDictionary");

            var userRides = new List<RideDTO>();

            using (var transaction = stateManager.CreateTransaction())
            {
                var enumerator = (await ridesDict.CreateEnumerableAsync(transaction)).GetAsyncEnumerator();

                while (await enumerator.MoveNextAsync(default))
                {
                    var rideDict = enumerator.Current.Value;

                    if (rideDict.Status == RideStatus.PENDING)
                    {
                        userRides.Add(new RideDTO(rideDict));
                    }
                }
            }

            var ridesForUserDb = _rideDbContext.Rides
                .Where(x => x.Status.Equals("PENDING"))
                .Select(x => new RideDTO(x))
                .ToList();

            userRides.AddRange(ridesForUserDb);

            return userRides;
        }

        public async Task<List<RideDTO>> GetAllRides()
        {
            var stateManager = this.StateManager;
            var ridesDict = await stateManager.GetOrAddAsync<IReliableDictionary<Guid, Ride>>("rideDictionary");

            var allRides = new List<RideDTO>();
            var rideIds = new HashSet<Guid>(); 

            using (var transaction = stateManager.CreateTransaction())
            {
                var enumerator = (await ridesDict.CreateEnumerableAsync(transaction)).GetAsyncEnumerator();

                while (await enumerator.MoveNextAsync(default))
                {
                    var rideDict = enumerator.Current.Value;

                    if (rideDict != null && rideIds.Add(rideDict.Id)) 
                    {
                        allRides.Add(new RideDTO(rideDict));
                    }
                }
            }

            var ridesFromDb = await _rideDbContext.Rides
                .Select(x => new RideDTO(x))
                .ToListAsync();

            foreach (var ride in ridesFromDb)
            {
                if (rideIds.Add(ride.Id)) 
                {
                    allRides.Add(ride);
                }
            }

            return allRides;
        }


        public async Task<List<RideDTO>> GetRidesForUser(Guid userId)
        {
            var stateManager = this.StateManager;
            var ridesDict = await stateManager.GetOrAddAsync<IReliableDictionary<Guid, Ride>>("rideDictionary");

            var userRides = new List<RideDTO>();

            using (var transaction = stateManager.CreateTransaction())
            {
                var enumerator = (await ridesDict.CreateEnumerableAsync(transaction)).GetAsyncEnumerator();

                while (await enumerator.MoveNextAsync(default))
                {
                    var rideDict = enumerator.Current.Value;

                    if (rideDict.UserId == userId && rideDict.Status == RideStatus.FINISHED)
                    {
                        userRides.Add(new RideDTO(rideDict));
                    }
                }
            }

            var ridesForUserDb = _rideDbContext.Rides
                .Where(x => x.UserId == userId && x.Status.Equals("FINISHED"))
                .Select(x => new RideDTO(x))
                .ToList();

            userRides.AddRange(ridesForUserDb);

            return userRides;
        }


        /// <summary>
        /// Optional override to create listeners (e.g., HTTP, Service Remoting, WCF, etc.) for this service replica to handle client or user requests.
        /// </summary>
        /// <remarks>
        /// For more information on service communication, see https://aka.ms/servicefabricservicecommunication
        /// </remarks>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return this.CreateServiceRemotingReplicaListeners();

        }

        /// <summary>
        /// This is the main entry point for your service replica.
        /// This method executes when this replica of your service becomes primary and has write status.
        /// </summary>
        /// <param name="cancellationToken">Canceled when Service Fabric needs to shut down this service replica.</param>
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following sample code with your own logic 
            //       or remove this RunAsync override if it's not needed in your service.

            var myDictionary = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, long>>("myDictionary");
            var stateMenager = this.StateManager;
            var rideDictionary = await stateMenager.GetOrAddAsync<IReliableDictionary<Guid, Ride>>("rideDictionary");

            try
            {
                foreach (Ride ride in this._rideDbContext.Rides.ToList())
                {
                    using var transaction = stateMenager.CreateTransaction();
                    await rideDictionary.AddOrUpdateAsync(transaction, ride.Id, ride, (k, v) => v);
                    await transaction.CommitAsync();
                }

            }
            catch (Exception ex)
            {

                throw;
            }
            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();

                using (var tx = this.StateManager.CreateTransaction())
                {
                    var result = await myDictionary.TryGetValueAsync(tx, "Counter");

                    ServiceEventSource.Current.ServiceMessage(this.Context, "Current Counter Value: {0}",
                        result.HasValue ? result.Value.ToString() : "Value does not exist.");

                    await myDictionary.AddOrUpdateAsync(tx, "Counter", 0, (key, value) => ++value);

                    // If an exception is thrown before calling CommitAsync, the transaction aborts, all changes are 
                    // discarded, and nothing is saved to the secondary replicas.
                    await tx.CommitAsync();
                }

                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
    }
}
