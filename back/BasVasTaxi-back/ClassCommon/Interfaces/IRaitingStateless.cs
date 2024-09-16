using ClassCommon.Models;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassCommon.Interfaces
{
    public interface IRaitingStateless : IService
    {
        Task<double> CalculateNewRaiting(List<Raiting> raitings);
    }
}
