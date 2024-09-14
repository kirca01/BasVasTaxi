using ClassCommon.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using ClassCommon.Shared;

namespace ClassCommon.Models
{
    public class Ride : IBaseEntity
    {
        public Guid Id { get; set; }
        public String StartAddress { get; set; }
        public String EndAddress { get; set; }
        public Double Price { get; set; }
        public Int32 WaitTime { get; set; }
        public Int32 TravelTime { get; set; }
        public Guid UserId { get; set; }
        public Guid DriverId { get; set; }
        public RideStatus Status { get; set; }

        public Ride() { }

        public Ride(Guid id, string startAddress, string endAddress, double price, int waitTime, int travelTime, Guid userId, Guid driverId, RideStatus status)
        {
            Id = id;
            StartAddress = startAddress;
            EndAddress = endAddress;
            Price = price;
            WaitTime = waitTime;
            TravelTime = travelTime;
            UserId = userId;
            DriverId = driverId;
            Status = status;
        }
    }
}
