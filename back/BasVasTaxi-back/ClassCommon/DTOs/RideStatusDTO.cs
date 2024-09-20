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
    public class RideStatusDTO
    {
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public RideStatus Status { get; set; }

        [DataMember]
        public int WaitTime { get; set; }

        [DataMember]
        public int TravelTime { get; set; }

        public RideStatusDTO()
        {
                
        }
    }
}
