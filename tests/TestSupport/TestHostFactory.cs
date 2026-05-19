using Inventorymanagementsystem.Api;
using Inventorymanagementsystem.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Inventorymanagementsystem.Tests.TestSupport;

public sealed class TestHostFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = "Server=(localdb)\\mssqllocaldb;Database=Test;Trusted_Connection=True",
                ["JwtSettings:Key"] = "0123456789abcdef0123456789abcdef0123456789abcdef",
                ["JwtSettings:Issuer"] = "Inventorymanagementsystem",
                ["JwtSettings:Audience"] = "InventorymanagementsystemClient",
                ["JwtSettings:ExpiresMinutes"] = "120",
                ["Redis:ConnectionString"] = "localhost:6379"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<AppDbContext>>();
            services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase($"integration-{Guid.NewGuid()}"));
            services.AddDistributedMemoryCache();

            using var scope = services.BuildServiceProvider().CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
        });
    }
}
