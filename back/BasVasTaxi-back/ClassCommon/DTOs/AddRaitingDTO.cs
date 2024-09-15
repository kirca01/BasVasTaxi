using ClassCommon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ClassCommon.DTOs
{
    [DataContract]
    public class AddRaitingDTO
    {
        [DataMember]
        public Guid UserId { get; set; }
        [DataMember]
        public double Raiting { get; set; }

        public AddRaitingDTO()
        {
                
        }

    }
}
