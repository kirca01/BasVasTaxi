using API_gateway.Services;
using ClassCommon.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API_gateway.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class RaitingManagementController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public readonly RaitingService _raitingService;

        public RaitingManagementController(IConfiguration configuration)
        {
            _configuration = configuration;
            _raitingService = new RaitingService(_configuration);
        }
        [HttpPost]
        public async Task<ActionResult> AddRaiting([FromBody] AddRaitingDTO dto)
        {
            try
            {
                await _raitingService.AddRaiting(dto.UserId, dto.Raiting);
                return Ok("Raiting added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
