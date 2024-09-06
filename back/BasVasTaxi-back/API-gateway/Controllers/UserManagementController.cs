using API_gateway.Services;
using ClassCommon;
using ClassCommon.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.Threading.Tasks.Dataflow;


namespace API_gateway.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class UserManagementController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public readonly UserService _userService;

        public UserManagementController(IConfiguration configuration)
        {
            _configuration = configuration;
            _userService = new UserService(_configuration);
        }


        [HttpGet]
        public async Task<String> GetHelloWorld()
        {
            return await _userService.GetHelloWorld();
        }


        [HttpPost]
        public async Task<ActionResult> Register([FromBody] UserDTO dto)
        {
            try
            {
                await _userService.Register(dto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("email")]
        public async Task<ActionResult<UserDTO>> GetByEmail([FromQuery] string email) 
        {
            try
            {

                UserDTO user = await _userService.GetByEmail(email);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return NotFound();
            }
        }
    }
}
