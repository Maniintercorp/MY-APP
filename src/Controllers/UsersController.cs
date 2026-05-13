// updated code without UserId for ProfileUpdateRequestDto

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using YourApp.DTOs;
using YourApp.Services;

namespace YourApp.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateRequestDto profileUpdateRequestDto)
        {
            var response = await _userService.UpdateProfileAsync(profileUpdateRequestDto);
            if (response == null)
            {
                _logger.LogWarning("Profile update failed for user {Email}", profileUpdateRequestDto.Email);
                return BadRequest("Profile update failed.");
            }

            return Ok(response);
        }
    }
}
