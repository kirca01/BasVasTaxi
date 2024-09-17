using ClassCommon.DTOs;
using ClassCommon.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClassCommon.Shared;

namespace ClassCommon.Models
{
    public class User : IBaseEntity
    {
        public Guid Id { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Email { get; set; }
        public String Username { get; set; }
        public String Password { get; set; }
        public Boolean IsActivated { get; set; }
        public String? Image { get; set; }
        public DateTime Birthday { get; set; }
        public String Address { get; set; }
        public UserRole Role { get; set; }
        public VerificationState VerificationState { get; set; }    

        public User(string firstName, string lastName, string email, string username, string password, bool isActivated, string? image, DateTime birthday, string address, UserRole role, VerificationState verificationState)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Username = username;
            Password = password;
            IsActivated = isActivated;
            Image = image;
            Birthday = birthday;
            Address = address;
            Role = role;
            VerificationState = verificationState;
        }

        public User()
        {
            IsActivated = false; 
        }

        public User(UserDTO dto)
        {
            FirstName = dto.FirstName;
            LastName = dto.LastName;
            Email = dto.Email;
            Username = dto.Username;
            Password = dto.Password;
            Birthday = dto.Birthday;
            Address = dto.Address;
            Role = dto.Role;
            IsActivated = false;
            VerificationState = dto.VerificationState;
        }
        public User(CreateUserDTO dto)
        {
            FirstName = dto.FirstName;
            LastName = dto.LastName;
            Email = dto.Email;
            Username = dto.Username;
            Password = dto.Password;
            Birthday = dto.Birthday;
            Address = dto.Address;
            Role = dto.Role;
            IsActivated = false;
        }
    }
}
