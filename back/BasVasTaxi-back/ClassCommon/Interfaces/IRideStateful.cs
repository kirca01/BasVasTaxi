using ClassCommon.DTOs;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassCommon.Interfaces
{
    public interface IRideStateful : IService
    {
        Task AcceptRide(Guid rideId, Guid driverId);
        Task<RideDTO> CreateRide(CreateRideDTO dto);
        Task DeleteRide(Guid rideId);
        Task<List<RideDTO>> GetAllPendingRides();
        Task<List<RideDTO>> GetAllRides();
        Task<List<RideDTO>> GetRidesForUser(Guid userId);
    }
}
