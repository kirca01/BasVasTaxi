using ClassCommon.Enums;
using ClassCommon.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ClassCommon.DTOs
{
    [DataContract]
    public class CreateUserDTO
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public String Username { get; set; }
        [DataMember]
        public String Password { get; set; }
        [DataMember]
        public String Email { get; set; }
        [DataMember]
        public String FirstName { get; set; }
        [DataMember]
        public String LastName { get; set; }
        [DataMember]
        public DateTime Birthday { get; set; }
        [DataMember]
        public String Address { get; set; }
        [DataMember]
        public UserRole Role { get; set; }
        [DataMember]
        public IFormFile? ImageFile { get; set; }


        public CreateUserDTO()
        {

        }

        public CreateUserDTO(User dto)
        {
            Id = dto.Id;
            Username = dto.Username;
            FirstName = dto.FirstName;
            LastName = dto.LastName;
            Password = dto.Password;
            Email = dto.Email;
            Address = dto.Address;
            Birthday = dto.Birthday;
            Role = dto.Role;
        }
    }
}
