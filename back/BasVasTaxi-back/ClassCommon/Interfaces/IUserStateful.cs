using ClassCommon.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassCommon.Interfaces
{
    public interface IUserStateful : IService
    {
        public Task<string> GetHelloWorld();
        Task Register(UserDTO dto, String image);
        Task<UserDTO> GetUserByEmail(String email);
        Task<List<UserDTO>> GetAllNonActivatedUsers();
        Task ActivateUser(Guid id);
        Task<UserDTO> UpdateUser(UpdateUserDTO dto);
        Task BlockUser(Guid id);
    }
}
