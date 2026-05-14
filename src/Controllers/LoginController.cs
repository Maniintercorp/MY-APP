using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MY_APP.DTOs;
using MY_APP.Services;
using System.Threading.Tasks;

namespace MY_APP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<LoginController> _logger;

        public LoginController(IUserService userService, ILogger<LoginController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] LoginRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _userService.AuthenticateAsync(requestDto);
                if (response == null)
                {
                    return Unauthorized(new { message = "Invalid username or password." });
                }
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Authentication failed for user {Username}", requestDto.Username);
                return StatusCode(500, new { message = "Internal server error." });
            }
        }
    }
}
