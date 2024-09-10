using API_gateway.Services;
using ClassCommon.DTOs;
using Microsoft.AspNetCore.Mvc;

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

    }
}
