using ClassCommon.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RaitingStateful
{
    public class RaitingDBContext : DbContext
    {
        public RaitingDBContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Raiting> Raitings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Raiting>().ToTable("Raitings");



        }
    }
}
