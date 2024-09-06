using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Helpers;
using System.Web.Mvc;
using ClassCommon.DTOs;
using ClassCommon.Enums;
using ClassCommon.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using UserStateful.Models;

namespace UserStateful
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    internal sealed class UserStateful : StatefulService, IUserStateful
    {
        private UserDBContext _userDbContext;
        public UserStateful(StatefulServiceContext context, IServiceProvider serviceProvider)
            : base(context)
        {
            _userDbContext = serviceProvider.GetService<UserDBContext>();
        }

        public async Task<string> GetHelloWorld()
        {
            return "Hello world";
        }

        public async Task<UserDTO> GetUserByEmail(string email)
        {
            //var stateManager = this.StateManager;
            //var usersDict = await stateManager.GetOrAddAsync<IReliableDictionary<Guid, User>>("userDictionary");

            //using (var transaction = stateManager.CreateTransaction())
            //{
            //    var enumerator = (await usersDict.CreateEnumerableAsync(transaction)).GetAsyncEnumerator();

            //    while (await enumerator.MoveNextAsync(default))
            //    {
            //        var user = enumerator.Current.Value;
            //        if (user.Email == email)
            //        {
            //            return user;
            //        }
            //    }
            //}
            if(string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email must be provided.");
            }

            User user = _userDbContext.Users.FirstOrDefault(u => u.Email == email);

            if(user == null) 
            {
                throw new InvalidOperationException($"User with email {email} does not exist.");
            }

            return new UserDTO(user);
        }

        public bool isValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }
            try
            {
                var emailRegex = new System.Text.RegularExpressions.Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                return emailRegex.IsMatch(email);
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task Register(UserDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Email))
            {
                throw new ArgumentException("Email must be provided.");
            }
            if (!isValidEmail(dto.Email))
            {
                throw new ArgumentException("Invalid email format.");
            }
            if(string.IsNullOrEmpty(dto.Password) || dto.Password.Length < 8)
            {
                throw new ArgumentException("Password must be at least 8 characters long.");
            }

            var existingUser = await _userDbContext.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if(existingUser != null) {
                throw new InvalidOperationException("A user with this email already exists.");
            }

            var stateMenager = this.StateManager;
            var userDictionary = await stateMenager.GetOrAddAsync<IReliableDictionary<Guid, User>>("userDictionary");

            dto.Role = UserRole.USER;
            User user = new User(dto);
            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            using (var transaction = stateMenager.CreateTransaction())
            {
                await userDictionary.AddOrUpdateAsync(transaction, user.Id, user, (k, v) => v);
                await transaction.CommitAsync();
            }
            await _userDbContext.Users.AddAsync(user);
            await _userDbContext.SaveChangesAsync();
            return;
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

            var myDictionary = await StateManager.GetOrAddAsync<IReliableDictionary<string, long>>("myDictionary");

            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();

                using (var tx = StateManager.CreateTransaction())
                {
                    var result = await myDictionary.TryGetValueAsync(tx, "Counter");

                    ServiceEventSource.Current.ServiceMessage(Context, "Current Counter Value: {0}",
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


