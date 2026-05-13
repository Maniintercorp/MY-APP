using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using YourApp.Services;

namespace YourApp.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IAuthService _authService;

        public JwtMiddleware(RequestDelegate next, IAuthService authService)
        {
            _next = next;
            _authService = authService;
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
                await AttachUserToContext(context, token);

            await _next(context);
        }

        private async Task AttachUserToContext(HttpContext context, string token)
        {
            try
            {
                var userId = _authService.ValidateToken(token);
                if (userId == null)
                {
                    return;
                }

                context.Items["User"] = await _authService.GetUserByIdAsync(userId.Value);
            }
            catch
            {
                // Do nothing if JWT validation fails
            }
        }
    }
}