using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using UserStateful.Models;

namespace ClassCommon.DTOs
{
    [DataContract]
    public class UpdateUserDTO
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public String Username { get; set; }

        [DataMember]
        public String Password { get; set; }
        [DataMember]
        public String FirstName { get; set; }
        [DataMember]
        public String LastName { get; set; }
        [DataMember]
        public DateTime Birthday { get; set; }
        [DataMember]
        public String Address { get; set; }
        [DataMember]
        public String? Image { get; set; }

        public UpdateUserDTO()
        {

        }

        public UpdateUserDTO(User dto)
        {
            Id = dto.Id;
            Username = dto.Username;
            FirstName = dto.FirstName;
            LastName = dto.LastName;
            Password = dto.Password;
            Address = dto.Address;
            Birthday = dto.Birthday;

        }
    }
}
