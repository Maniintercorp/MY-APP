// Minimal implementation based on the expected API contract
using Microsoft.AspNetCore.Mvc;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class LoginUser
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
        }

        public class LoginResponse
        {
            public string Token { get; set; }
            public LoginUser User { get; set; }
            public string Error { get; set; } // Should be null if login succeeds
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Example pseudo-logic; in real use, authenticate user properly
            if (request.Email == "test@example.com" && request.Password == "password")
            {
                var user = new LoginUser
                {
                    Id = "1",
                    Name = "Test User",
                    Email = request.Email
                };
                return Ok(new LoginResponse
                {
                    Token = "sample.jwt.token",
                    User = user,
                    Error = null
                });
            }

            return Ok(new LoginResponse { Token = null, User = null, Error = "Invalid credentials." });
        }
    }
}
