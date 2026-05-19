using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.Services;

namespace Inventorymanagementsystem.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICacheService, RedisCacheService>();
        return services;
    }
}
