using API_gateway.Services;
using ClassCommon.DTOs;
using ClassCommon.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API_gateway.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class RideManagementController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public readonly RideService _rideService;

        public RideManagementController(IConfiguration configuration)
        {
            _configuration = configuration;
            _rideService = new RideService(_configuration);
        }


        [HttpPost]
        [Authorize]
        [Authorize(Roles = "USER")]
        public async Task<ActionResult<RideDTO>> CreateRide([FromBody] CreateRideDTO dto)
        {
            try
            {
                RideDTO rideDto = await _rideService.CreateRide(dto);
                return Ok(rideDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpGet("{userId:Guid}")]
        //[Authorize]
        //[Authorize(Roles = "USER")]
        public async Task<ActionResult<List<RideDTO>>> GetRidesForUser(Guid userId)
        {
            try
            {
                List<RideDTO> lists = await _rideService.GetRidesForUser(userId);
                return Ok(lists);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpGet("{driverId:Guid}")]
        //[Authorize]
        //[Authorize(Roles = "USER")]
        public async Task<ActionResult<List<RideDTO>>> GetRidesForDriver(Guid driverId)
        {
            try
            {
                List<RideDTO> lists = await _rideService.GetRidesForDriver(driverId);
                return Ok(lists);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<RideDTO>>> GetAllPendingRides()
        {
            try
            {
                List<RideDTO> lists = await _rideService.GetAllPendingRides();
                return Ok(lists);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<RideDTO>>> GetAllRides()
        {
            try
            {
                List<RideDTO> lists = await _rideService.GetAllRides();
                return Ok(lists);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("{rideId:Guid}")]
        [Authorize(Roles = "USER")]
        public async Task<ActionResult> DeleteRide(Guid rideId)
        {
            try
            {
                await _rideService.DeleteRide(rideId);
                return NoContent(); 
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("accept-ride/{rideId:Guid}/driver/{driverId:Guid}")]
        [Authorize]
        //[Authorize(Roles = "DRIVER")]
        public async Task<ActionResult> AcceptRide(Guid rideId, Guid driverId)
        {
            try
            {
                await _rideService.AcceptRide(rideId, driverId);
                return Ok("Ride accepted by driver");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("finish-ride/{rideId:Guid}")]
        [Authorize]
        //[Authorize(Roles = "DRIVER")]
        public async Task<ActionResult> FinishRide(Guid rideId)
        {
            try
            {
                await _rideService.FinishRide(rideId);
                return Ok("Ride accepted by driver");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{rideId:Guid}/status")]
        [Authorize]
        public async Task<ActionResult<RideStatusDTO>> GetRideStatus(Guid rideId)
        {
            try
            {
                var ride = await _rideService.GetRideStatus(rideId);
                if (ride == null)
                {
                    return NotFound();
                }

                var statusDto = new RideStatusDTO
                {
                    Id = ride.Id,
                    Status = ride.Status,
                    WaitTime = ride.WaitTime,
                    TravelTime = ride.TravelTime
                };

                return Ok(statusDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
