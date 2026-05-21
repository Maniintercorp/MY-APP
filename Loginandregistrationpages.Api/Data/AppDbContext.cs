using Loginandregistrationpages.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Loginandregistrationpages.Api.Data;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users", "dbo");

            entity.HasKey(user => user.Id)
                .HasName("PK_Users");

            entity.Property(user => user.Id)
                .HasColumnType("uniqueidentifier")
                .HasDefaultValueSql("NEWID()");

            entity.Property(user => user.FirstName)
                .HasColumnType("nvarchar(100)")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(user => user.LastName)
                .HasColumnType("nvarchar(100)")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(user => user.Email)
                .HasColumnType("nvarchar(256)")
                .HasMaxLength(256)
                .IsRequired();

            entity.Property(user => user.NormalizedEmail)
                .HasColumnType("nvarchar(256)")
                .HasMaxLength(256)
                .IsRequired();

            entity.Property(user => user.PasswordHash)
                .HasColumnType("nvarchar(500)")
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(user => user.IsActive)
                .HasColumnType("bit")
                .HasDefaultValue(true)
                .IsRequired();

            entity.Property(user => user.CreatedAtUtc)
                .HasColumnType("datetime2")
                .HasDefaultValueSql("SYSUTCDATETIME()")
                .IsRequired();

            entity.Property(user => user.UpdatedAtUtc)
                .HasColumnType("datetime2");

            entity.Property(user => user.LastLoginAtUtc)
                .HasColumnType("datetime2");

            entity.Property(user => user.CreatedAt)
                .HasColumnType("datetime2")
                .HasDefaultValueSql("SYSUTCDATETIME()")
                .IsRequired();

            entity.Property(user => user.UpdatedAt)
                .HasColumnType("datetime2");

            entity.Property(user => user.IsDeleted)
                .HasColumnType("bit")
                .HasDefaultValue(false)
                .IsRequired();

            entity.HasIndex(user => user.NormalizedEmail)
                .IsUnique()
                .HasDatabaseName("UX_Users_NormalizedEmail");

            entity.HasIndex(user => user.Email)
                .HasDatabaseName("IX_Users_Email");

            entity.HasIndex(user => new { user.IsDeleted, user.IsActive })
                .HasDatabaseName("IX_Users_IsDeleted_IsActive");

            entity.HasIndex(user => user.CreatedAtUtc)
                .HasDatabaseName("IX_Users_CreatedAtUtc");

            entity.HasCheckConstraint("CK_Users_FirstName_NotEmpty", "LEN(LTRIM(RTRIM([FirstName]))) > 0");
            entity.HasCheckConstraint("CK_Users_LastName_NotEmpty", "LEN(LTRIM(RTRIM([LastName]))) > 0");
            entity.HasCheckConstraint("CK_Users_Email_NotEmpty", "LEN(LTRIM(RTRIM([Email]))) > 0");
            entity.HasCheckConstraint("CK_Users_NormalizedEmail_NotEmpty", "LEN(LTRIM(RTRIM([NormalizedEmail]))) > 0");
            entity.HasCheckConstraint("CK_Users_PasswordHash_NotEmpty", "LEN(LTRIM(RTRIM([PasswordHash]))) > 0");

            entity.HasQueryFilter(user => !user.IsDeleted);
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<User>())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity.CreatedAtUtc == default)
                {
                    entry.Entity.CreatedAtUtc = now;
                }

                if (entry.Entity.CreatedAt == default)
                {
                    entry.Entity.CreatedAt = now;
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAtUtc = now;
                entry.Entity.UpdatedAt = now;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
