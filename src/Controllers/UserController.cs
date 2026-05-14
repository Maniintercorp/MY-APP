using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MyApp.Services;
using MyApp.DTOs;
using MyApp.Validators;
using FluentValidation.Results;

namespace MyApp.Controllers
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
        public async Task<IActionResult> Login([FromBody] UserLoginDTO userLoginDTO)
        {
            var validator = new UserLoginValidator();
            ValidationResult result = validator.Validate(userLoginDTO);

            if (!result.IsValid)
            {
                foreach (var failure in result.Errors)
                {
                    ModelState.AddModelError(failure.PropertyName, failure.ErrorMessage);
                }

                return BadRequest(ModelState);
            }

            try
            {
                var (token, userId, error) = await _userService.AuthenticateAsync(userLoginDTO);
                if (!string.IsNullOrEmpty(error))
                {
                    return Unauthorized(new { error });
                }
                return Ok(new { token, userId, error = (string)null });
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "An error occurred during login.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }
    }
}
