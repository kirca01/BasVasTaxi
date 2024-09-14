using ClassCommon.Enums;
using ClassCommon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ClassCommon.DTOs
{
    [DataContract]
    public class RideDTO
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public String StartAddress { get; set; }
        [DataMember]
        public String EndAddress { get; set; }
        [DataMember]
        public Double Price { get; set; }
        [DataMember]
        public Int32 WaitTime { get; set; }
        [DataMember]
        public Int32 TravelTime { get; set; }
        [DataMember]
        public Guid UserId { get; set; }
        [DataMember]
        public Guid DriverId { get; set; }
        [DataMember]
        public RideStatus Status { get; set; }

        public RideDTO()
        {
                
        }

        public RideDTO(Ride ride)
        {
            Id = ride.Id;
            StartAddress = ride.StartAddress;
            EndAddress = ride.EndAddress;
            Price = ride.Price;
            WaitTime = ride.WaitTime;
            TravelTime = ride.TravelTime;
            UserId = ride.UserId;
            DriverId = ride.DriverId;
            Status = ride.Status;
        }
    }
}
