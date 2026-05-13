using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MY_APP.DTOs;
using MY_APP.Services;
using Microsoft.Extensions.Logging;

namespace MY_APP.Controllers
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
        public async Task<IActionResult> Login([FromBody] UserLoginDTO userLoginDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid login request received.");
                return BadRequest("Invalid data.");
            }

            var result = await _authService.AuthenticateAsync(userLoginDTO);

            if (!result.Success)
            {
                _logger.LogWarning("Login failed for user {Username}.", userLoginDTO.Username);
                return Unauthorized(result.Error);
            }

            return Ok(new { token = result.Token, expiresIn = result.ExpiresIn, error = result.Error });
        }
    }
}
