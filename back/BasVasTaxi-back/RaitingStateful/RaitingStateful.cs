using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ClassCommon.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using ClassCommon.Interfaces;
using Microsoft.ServiceFabric.Services.Remoting.Client;


namespace RaitingStateful
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    internal sealed class RaitingStateful : StatefulService, IRaitingStateful
    {
        private RaitingDBContext _raitingDbContext;
        private readonly IRaitingStateless _raitingStateless;
        public RaitingStateful(StatefulServiceContext context, IServiceProvider serviceProvider)
            : base(context)
        {
            _raitingDbContext = serviceProvider.GetService<RaitingDBContext>();

            _raitingStateless = ServiceProxy.Create<IRaitingStateless>(
                new Uri("fabric:/BasVasTaxi-back/RaitingStateless"));
            
        }

        public async Task AddRaiting(Guid userId, double newRaiting)
        {
            var stateManager = this.StateManager;
            var raitingDictionary = await stateManager.GetOrAddAsync<IReliableDictionary<Guid, Raiting>>("raitingDictionary");

            using (var transaction = stateManager.CreateTransaction())
            {

                var newRaitingEntry = new Raiting
                {
                    Id = Guid.NewGuid(),
                    UserID = userId,
                    Raitings = newRaiting
                };

                await raitingDictionary.AddAsync(transaction, userId, newRaitingEntry);
                await transaction.CommitAsync();
            }



            Raiting newRaitingInDb = new Raiting(Guid.NewGuid(), userId, newRaiting);
            await _raitingDbContext.Raitings.AddAsync(newRaitingInDb);

            await _raitingDbContext.SaveChangesAsync();
        }

        public async Task<double> GetAverageRating(Guid userId)
        {
            List<Raiting> raitings = await GetRaitingsByUserId(userId);

            double average = await _raitingStateless.CalculateNewRaiting(raitings);

            return average;
        }

        private async Task<List<Raiting>> GetRaitingsByUserId(Guid userId)
        {
            var stateManager = this.StateManager;
            var raitingDictionary = await stateManager.GetOrAddAsync<IReliableDictionary<Guid, Raiting>>("raitingDictionary");

            using (var transaction = stateManager.CreateTransaction())
            {
                var enumerator = (await raitingDictionary.CreateEnumerableAsync(transaction)).GetAsyncEnumerator();
                var allRaitingsById = new List<Raiting>();
                while (await enumerator.MoveNextAsync(default))
                {
                    var raiting = enumerator.Current.Value;
                    if (raiting != null && raiting.UserID == userId)
                    {
                        allRaitingsById.Add(raiting);
                    }
                }
                return allRaitingsById;
            }

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
            var raitingDictionary = await stateMenager.GetOrAddAsync<IReliableDictionary<Guid, Raiting>>("raitingDictionary");

            try
            {
                foreach (Raiting raiting in this._raitingDbContext.Raitings.ToList())
                {
                    using var transaction = stateMenager.CreateTransaction();
                    await raitingDictionary.AddOrUpdateAsync(transaction, raiting.Id, raiting, (k, v) => v);
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
