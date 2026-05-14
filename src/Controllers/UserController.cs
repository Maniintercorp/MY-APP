using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MY_APP.DTOs;
using MY_APP.Services;
using Microsoft.Extensions.Logging;

namespace MY_APP.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.AuthenticateAsync(loginRequest);

            if (result == null)
            {
                return Unauthorized();
            }

            return Ok(result);
        }
    }
}
