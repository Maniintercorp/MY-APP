using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MyApp.Repositories;
using MyApp.DTOs;
using MyApp.Models;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Text;

namespace MyApp.Services
{
    public interface IUserService
    {
        Task<(string token, int userId, string error)> AuthenticateAsync(UserLoginDTO userLoginDTO);
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<(string token, int userId, string error)> AuthenticateAsync(UserLoginDTO userLoginDTO)
        {
            var user = await _userRepository.FindByEmailAsync(userLoginDTO.Email);

            if (user == null)
            {
                return (null, 0, "Invalid credentials.");
            }

            if (!VerifyPassword(userLoginDTO.Password, user.PasswordHash))
            {
                return (null, 0, "Invalid credentials.");
            }

            var token = GenerateJwtToken(user);
            return (token, user.UserId, null);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(storedHash));
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return storedHash == Convert.ToBase64String(computedHash);
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("YourSecretKeyHere"); // replace with a real secret
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[] { new System.Security.Claims.Claim("id", user.UserId.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
