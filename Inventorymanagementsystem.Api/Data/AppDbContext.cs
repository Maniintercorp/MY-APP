using Microsoft.EntityFrameworkCore;
using Inventorymanagementsystem.Models;

namespace Inventorymanagementsystem.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ApplicationUser> Users => Set<ApplicationUser>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();
    public DbSet<InventoryManagementSystemEntity> InventoryManagementSystems => Set<InventoryManagementSystemEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable("Users");
            entity.HasQueryFilter(x => !x.IsDeleted);
            entity.Property(x => x.FullName).HasMaxLength(150).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(256).IsRequired();
            entity.Property(x => x.PasswordHash).IsRequired();
            entity.Property(x => x.Role).HasMaxLength(50).IsRequired();
            entity.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasQueryFilter(x => !x.IsDeleted);
            entity.Property(x => x.Name).HasMaxLength(100).IsRequired();
            entity.Property(x => x.Description).HasMaxLength(500);
            entity.HasIndex(x => x.Name).IsUnique();
            entity.HasMany(x => x.Products).WithOne(x => x.Category).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
            entity.HasData(
                new Category { Id = 1, Name = "General", Description = "Default inventory category", CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new Category { Id = 2, Name = "Raw Materials", Description = "Raw material inventory", CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
            );
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasQueryFilter(x => !x.IsDeleted);
            entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
            entity.Property(x => x.SKU).HasMaxLength(80).IsRequired();
            entity.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
            entity.HasIndex(x => x.SKU).IsUnique();
            entity.ToTable(t =>
            {
                t.HasCheckConstraint("CK_Products_Quantity", "[Quantity] >= 0");
                t.HasCheckConstraint("CK_Products_UnitPrice", "[UnitPrice] >= 0");
                t.HasCheckConstraint("CK_Products_ReorderLevel", "[ReorderLevel] >= 0");
            });
        });

        modelBuilder.Entity<StockMovement>(entity =>
        {
            entity.HasQueryFilter(x => !x.IsDeleted);
            entity.Property(x => x.MovementType).HasConversion<string>().HasMaxLength(20).IsRequired();
            entity.Property(x => x.Reason).HasMaxLength(500);
            entity.HasOne(x => x.Product).WithMany(x => x.StockMovements).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.CreatedByUser).WithMany(x => x.StockMovements).HasForeignKey(x => x.CreatedByUserId).OnDelete(DeleteBehavior.SetNull);
            entity.ToTable(t => t.HasCheckConstraint("CK_StockMovements_Quantity", "[Quantity] > 0"));
        });

        modelBuilder.Entity<InventoryManagementSystemEntity>(entity =>
        {
            entity.HasQueryFilter(x => !x.IsDeleted);
            entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
            entity.Property(x => x.Description).HasMaxLength(500);
            entity.Property(x => x.Status).HasMaxLength(50).IsRequired();
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
