using Microsoft.AspNetCore.Mvc;
using MY_APP.Services;
using MY_APP.DTOs;
using MY_APP.Validators;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

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
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequest)
        {
            var validator = new LoginRequestValidator();
            ValidationResult result = validator.Validate(loginRequest);

            if (!result.IsValid)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.PropertyName, error.ErrorMessage);
                }
                return BadRequest(ModelState);
            }

            var response = await _authService.AuthenticateAsync(loginRequest);

            if (response == null)
            {
                return Unauthorized();
            }

            return Ok(response);
        }
    }
}
