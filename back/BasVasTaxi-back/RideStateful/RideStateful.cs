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
