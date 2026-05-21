using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Loginandregistrationpages.Api.Models;

namespace Loginandregistrationpages.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            // Authentication logic here
            return Ok(new LoginResponse { Token = "sampleToken", UserId = 1 });
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
        {
            // Registration logic here
            return Ok(new RegisterResponse { UserId = 1, Message = "User registered successfully" });
        }
    }
}
