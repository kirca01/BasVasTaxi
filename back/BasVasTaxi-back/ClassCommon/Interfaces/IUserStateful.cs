using ClassCommon.DTOs;
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
        Task Register(UserDTO dto);
        Task<UserDTO> GetUserByEmail(String email);
        Task<List<UserDTO>> GetAllNonActivatedUsers();
        Task ActivateUser(Guid id);
        Task<UserDTO> UpdateUser(UpdateUserDTO dto);
    }
}
