using System;
using System.Threading.Tasks;
using MY_APP.DTOs;
using MY_APP.Repositories;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;

namespace MY_APP.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> AuthenticateAsync(LoginRequestDto loginRequest);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<AuthService> _logger;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, ILogger<AuthService> logger, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto> AuthenticateAsync(LoginRequestDto loginRequest)
        {
            var user = await _userRepository.GetUserByUsernameAsync(loginRequest.Username);

            if (user == null || !VerifyPasswordHash(loginRequest.Password, user.PasswordHash))
            {
                return null;
            }

            var token = GenerateJwtToken(user);

            return new LoginResponseDto
            {
                Token = token,
                Expiration = DateTime.UtcNow.AddHours(1).ToString("o")
            };
        }

        private bool VerifyPasswordHash(string password, string storedHash)
        {
            // Implement password hash checking logic here
            return storedHash == password; // Simplified for demonstration
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[]
                {
                    new System.Security.Claims.Claim("id", user.UserId.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
