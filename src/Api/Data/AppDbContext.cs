using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<SupportedLocale> SupportedLocales => Set<SupportedLocale>();
    public DbSet<TranslationResource> TranslationResources => Set<TranslationResource>();
    public DbSet<UserLanguagePreference> UserLanguagePreferences => Set<UserLanguagePreference>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SupportedLocale>(entity =>
        {
            entity.HasKey(x => x.Code);
            entity.Property(x => x.Code).HasColumnType("varchar(16)").IsRequired();
            entity.Property(x => x.DisplayName).HasColumnType("nvarchar(100)").IsRequired();
            entity.Property(x => x.NativeName).HasColumnType("nvarchar(100)").IsRequired();
            entity.Property(x => x.IsDefault).HasColumnType("bit").IsRequired();
            entity.Property(x => x.IsEnabled).HasColumnType("bit").IsRequired();
            entity.Property(x => x.Direction).HasColumnType("varchar(3)").IsRequired();
        });

        modelBuilder.Entity<TranslationResource>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnType("uniqueidentifier").IsRequired();
            entity.Property(x => x.LocaleCode).HasColumnType("varchar(16)").IsRequired();
            entity.Property(x => x.Namespace).HasColumnType("nvarchar(64)").IsRequired();
            entity.Property(x => x.ResourcesJson).HasColumnType("nvarchar(max)").IsRequired();
            entity.HasIndex(x => new { x.LocaleCode, x.Namespace }).IsUnique();
        });

        modelBuilder.Entity<UserLanguagePreference>(entity =>
        {
            entity.HasKey(x => x.UserId);
            entity.Property(x => x.UserId).HasColumnType("nvarchar(450)").IsRequired();
            entity.Property(x => x.PreferredLanguageCode).HasColumnType("varchar(16)").IsRequired();
            entity.Property(x => x.UpdatedAt).HasColumnType("datetimeoffset").IsRequired();
        });
    }
}
