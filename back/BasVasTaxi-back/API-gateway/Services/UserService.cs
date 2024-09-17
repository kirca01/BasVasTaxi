using ClassCommon.DTOs;
using ClassCommon.Interfaces;
using ClassCommon.Models;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace API_gateway.Services
{
    public class UserService
    {
        public readonly IUserStateful _userManagementService;
        public readonly IConfiguration _configuration;


        public UserService(IConfiguration configuration)
        {
            _configuration = configuration;
            _userManagementService = ServiceProxy.Create<IUserStateful>(
                new Uri(_configuration.GetValue<string>("ProxyUrls:UserStateful")!), new ServicePartitionKey(1));
        }

        public async Task<string> GetHelloWorld()
        {
            return await _userManagementService.GetHelloWorld();
        }

        public async Task Register(CreateUserDTO dto, IFormFile image)
        {
            string imagePath = "";
            if (image != null)
            {
                string ImageName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                string SavePath = Path.Combine("static/profilePictures", ImageName);
                using (var stream = new FileStream(SavePath, FileMode.Create))
                {
                    image.CopyTo(stream);
                }
                imagePath = SavePath;
            }

            await _userManagementService.Register(new UserDTO(dto), imagePath);
        }

        public async Task<UserDTO> GetByEmail(string email)
        {
            return await _userManagementService.GetUserByEmail(email);
        }

        public async Task<List<UserDTO>> GetAllNonActivatedUsers()
        {
            return await _userManagementService.GetAllNonActivatedUsers();
        }

        public async Task ActivateUser(Guid id)
        {
            await _userManagementService.ActivateUser(id);
        }

        public async Task<UserDTO> UpdateUser(UpdateUserDTO dto)
        {
            return await _userManagementService.UpdateUser(dto);
        }

        public async Task BlockUser(Guid id)
        {
            await _userManagementService.BlockUser(id);
        }

        internal async Task<UserDTO> GetById(Guid id)
        {
            return await _userManagementService.GetById(id);
        }
    }
}
