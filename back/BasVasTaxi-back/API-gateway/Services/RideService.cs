using ClassCommon.DTOs;
using ClassCommon.Interfaces;
using ClassCommon.Models;
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

        public async Task<List<RideDTO>> GetRidesForUser(Guid userId)
        {
            return await _rideManagementService.GetRidesForUser(userId);
        }

        public async Task<List<RideDTO>> GetAllPendingRides()
        {
            return await _rideManagementService.GetAllPendingRides();
        }

        public async Task<List<RideDTO>> GetAllRides()
        {
            return await _rideManagementService.GetAllRides();
        }

        public async Task DeleteRide(Guid rideId)
        {
            await _rideManagementService.DeleteRide(rideId);
        }

        public async Task AcceptRide(Guid rideId, Guid driverId)
        {
            await _rideManagementService.AcceptRide(rideId, driverId);
        }

        public async Task<List<RideDTO>> GetRidesForDriver(Guid driverId)
        {
            return await _rideManagementService.GetRidesForDriver(driverId);
        }
    }
}
