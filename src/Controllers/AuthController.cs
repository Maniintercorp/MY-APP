using Microsoft.AspNetCore.Mvc;
using MyApp.Services;
using MyApp.DTOs;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace MyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            var result = await _authService.AuthenticateUserAsync(loginDto);

            if (result == null)
            {
                _logger.LogWarning("Login failed for user {Email}", loginDto.Email);
                return BadRequest("Invalid login attempt.");
            }

            return Ok(result);
        }
    }
}