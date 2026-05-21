using Loginandregistrationpages.Api.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Loginandregistrationpages.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            // Register more services here if needed
        }

        public static void AddValidators(this IServiceCollection services)
        {
            // Validators auto-registered by AddFluentValidation in Program.cs
        }
    }
}
