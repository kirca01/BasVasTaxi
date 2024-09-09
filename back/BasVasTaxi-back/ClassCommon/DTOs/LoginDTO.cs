using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ClassCommon.DTOs
{
    [DataContract]
    public class LoginDTO
    {
        [DataMember]
        public String Email { get; set; }
        [DataMember]
        public String Password { get; set; }

        public LoginDTO()
        {
                
        }
    }
}
