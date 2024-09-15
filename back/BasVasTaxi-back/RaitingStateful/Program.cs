using System;
using System.Diagnostics;
using System.Fabric;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Runtime;

namespace RaitingStateful
{
    internal static class Program
    {
        /// <summary>
        /// This is the entry point of the service host process.
        /// </summary>
        private static void Main()
        {
            try
            {
                // The ServiceManifest.XML file defines one or more service type names.
                // Registering a service maps a service type name to a .NET type.
                // When Service Fabric creates an instance of this service type,
                // an instance of the class is created in this host process.

                CodePackageActivationContext context = FabricRuntime.GetActivationContext();
                var configSettings = context.GetConfigurationPackageObject("Config").Settings;
                var data = configSettings.Sections["DatabaseConfig"];
                var connectionString = "";
                foreach (var parameter in data.Parameters)
                {
                    if (parameter.Name == "ConnectionString")
                    {
                        connectionString = parameter.Value;
                    }
                }

                var provider = new ServiceCollection().AddDbContext<RaitingDBContext>(options => options.UseNpgsql(connectionString)).BuildServiceProvider();

                ServiceRuntime.RegisterServiceAsync("RaitingStatefulType",
                    context => new RaitingStateful(context, provider)).GetAwaiter().GetResult();

                ServiceEventSource.Current.ServiceTypeRegistered(Process.GetCurrentProcess().Id, typeof(RaitingStateful).Name);

                // Prevents this host process from terminating so services keep running.
                Thread.Sleep(Timeout.Infinite);
            }
            catch (Exception e)
            {
                ServiceEventSource.Current.ServiceHostInitializationFailed(e.ToString());
                throw;
            }
        }
    }
}
