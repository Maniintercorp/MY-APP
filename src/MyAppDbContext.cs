using Microsoft.EntityFrameworkCore;
using MyApp.Models;

namespace MyApp
{
    public class MyAppDbContext : DbContext
    {
        public MyAppDbContext(DbContextOptions<MyAppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.UserId);
            modelBuilder.Entity<User>().Property(u => u.Email).IsRequired().HasMaxLength(255);
            modelBuilder.Entity<User>().Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
        }
    }
}
