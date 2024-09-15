using ClassCommon.Interfaces;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace API_gateway.Services
{
    public class RaitingService
    {
        public readonly IRaitingStateful _raitingManagementService;
        public readonly IConfiguration _configuration;


        public RaitingService(IConfiguration configuration)
        {
            _configuration = configuration;
            _raitingManagementService = ServiceProxy.Create<IRaitingStateful>(
                new Uri(_configuration.GetValue<string>("ProxyUrls:RaitingStateful")!), new ServicePartitionKey(3));
        }

        public async Task AddRaiting(Guid userId, double raiting)
        {
            await _raitingManagementService.AddRaiting(userId, raiting);
        }
    }
}
