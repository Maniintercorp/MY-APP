using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using YourApp.DTOs;
using YourApp.Services;

namespace YourApp.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto registerRequestDto)
        {
            var response = await _authService.RegisterAsync(registerRequestDto);
            if (response == null)
            {
                _logger.LogWarning("Registration failed for email {Email}", registerRequestDto.Email);
                return BadRequest("Registration failed.");
            }

            return CreatedAtAction(nameof(Register), new { response.UserId }, response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto loginRequestDto)
        {
            var token = await _authService.LoginAsync(loginRequestDto);
            if (token == null)
            {
                _logger.LogWarning("Login failed for email {Email}", loginRequestDto.Email);
                return Unauthorized("Invalid credentials.");
            }

            return Ok(new { Token = token });
        }
    }
}