using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ClassCommon.Models
{
    public class Raiting
    {
        public Guid Id { get; set; } 
        public Guid UserID { get; set; }
        public double Raitings { get; set; }
        public int NumOfRates { get; set; }

        public Raiting()
        {
                
        }
        public Raiting(Guid id, Guid userID, double raitings, int numOfRates)
        {
            Id = id;
            UserID = userID;
            Raitings = raitings;
            NumOfRates = numOfRates;
        }
    }
}
