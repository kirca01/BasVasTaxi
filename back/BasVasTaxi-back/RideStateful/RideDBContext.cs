using ClassCommon.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RideStateful
{
    public class RideDBContext : DbContext
    {
        public RideDBContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Ride> Rides { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Ride>().ToTable("Rides");



        }
    }
}
