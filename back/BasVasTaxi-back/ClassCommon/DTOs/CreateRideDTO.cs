using ClassCommon.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ClassCommon.DTOs
{
    [DataContract]
    public class CreateRideDTO
    {
        [DataMember]
        public Guid UserID { get; set; }    
        [DataMember]
        public String StartAddress { get; set; }
        [DataMember]
        public String EndAddress { get; set; }

        public CreateRideDTO()
        {

        }

    }
}
