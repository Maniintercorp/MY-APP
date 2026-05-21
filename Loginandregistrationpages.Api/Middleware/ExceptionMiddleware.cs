using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace Loginandregistrationpages.Api.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/problem+json";
            var statusCode = (int)HttpStatusCode.InternalServerError;

            var details = new
            {
                title = "An error occurred while processing your request.",
                status = statusCode,
                detail = ex.Message
            };
            context.Response.StatusCode = statusCode;
            var json = JsonSerializer.Serialize(details);
            return context.Response.WriteAsync(json);
        }
    }
}
