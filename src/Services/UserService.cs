using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MY_APP.DTOs;
using MY_APP.Models;
using MY_APP.Repositories;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MY_APP.Services
{
    public interface IUserService
    {
        Task<LoginResponseDto> AuthenticateAsync(LoginRequestDto requestDto);
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, IConfiguration configuration, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<LoginResponseDto> AuthenticateAsync(LoginRequestDto requestDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(requestDto.Username);
            if (user == null || !VerifyPassword(requestDto.Password, user.PasswordHash, user.Salt))
            {
                return null;
            }

            var token = GenerateJwtToken(user);
            return new LoginResponseDto { Token = token, Message = "Login successful." };
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtConfig:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, user.Username) }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private bool VerifyPassword(string password, byte[] storedHash, byte[] storedSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }
            return true;
        }
    }
}
