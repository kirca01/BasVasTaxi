using ClassCommon.DTOs;
using ClassCommon.Interfaces;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace API_gateway.Services
{
    public class RideService
    {
        public readonly IRideStateful _rideManagementService;
        public readonly IConfiguration _configuration;


        public RideService(IConfiguration configuration)
        {
            _configuration = configuration;
            _rideManagementService = ServiceProxy.Create<IRideStateful>(
                new Uri(_configuration.GetValue<string>("ProxyUrls:RideStateful")!), new ServicePartitionKey(2));
        }

        public async Task<RideDTO> CreateRide(CreateRideDTO dto)
        {
            return await _rideManagementService.CreateRide(dto);
        }
    }
}
