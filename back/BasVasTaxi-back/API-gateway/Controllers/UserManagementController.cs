﻿using API_gateway.Services;
using ClassCommon;
using ClassCommon.DTOs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks.Dataflow;
using static System.Runtime.InteropServices.JavaScript.JSType;


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


        

        [HttpPost]
        public async Task<ActionResult> Login([FromBody] LoginDTO dto)
        {
            try
            {
                UserDTO user = await _userService.GetByEmail(dto.Email);
                if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                {
                    throw new ArgumentException("Wrong password");
                }

                var tokenHandler = new JwtSecurityTokenHandler();

                var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                var userClaims = new[]
                {
                    new Claim("user_id", user.Id.ToString()),
                    new Claim("user_role", user.Role.ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                };

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: userClaims,
                    signingCredentials: credentials,
                    expires: DateTime.Now.AddDays(5)
                );


                return Ok(tokenHandler.WriteToken(token));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }


        [HttpPost]
        public async Task<ActionResult> Register([FromForm] CreateUserDTO dto)
        {
            try
            {
                await _userService.Register(dto, dto.ImageFile);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<string>> whoAmI()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
            {
                return BadRequest("JWT error");
            }
            string role = identity.FindFirst(ClaimTypes.Role)?.Value;
            string id = identity.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("User identifier not found");
            }
            return Ok(JsonConvert.SerializeObject(new { role, id }, Newtonsoft.Json.Formatting.Indented));

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

        [HttpGet]
        public async Task<ActionResult<List<UserDTO>>> GetAllNonActivatedUsers()
        {
            try
            {
                List<UserDTO> users = await _userService.GetAllNonActivatedUsers();
                return Ok(users);
            }
            catch(Exception ex)
            {
                return NotFound(ex);
            }
        }

        [HttpPut]
        [Authorize]
        [Authorize(Roles = "ADMINISTRATOR")]
        public async Task<ActionResult> ActivateUser([FromQuery] Guid id)
        {
            try
            {
                await _userService.ActivateUser(id);
                return Ok();
            }
            catch(Exception ex)
            {
                return NotFound(ex);
            }
        }

        [HttpPut]
        [Authorize]
        [Authorize(Roles = "ADMINISTRATOR")]
        public async Task<ActionResult> BlockUser([FromQuery] Guid id)
        {
            try
            {
                await _userService.BlockUser(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult<UserDTO>> UpdateUser([FromBody] UpdateUserDTO dto)
        {
            try
            {
                UserDTO user = await _userService.UpdateUser(dto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return NotFound(ex);
            }
        }
    }
}
