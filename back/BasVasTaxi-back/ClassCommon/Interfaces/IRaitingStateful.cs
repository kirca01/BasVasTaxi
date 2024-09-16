using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassCommon.Interfaces
{
    public interface IRaitingStateful : IService
    {
        Task AddRaiting(Guid userId, double raiting);
        Task<double> GetAverageRating(Guid userId);
    }
}
