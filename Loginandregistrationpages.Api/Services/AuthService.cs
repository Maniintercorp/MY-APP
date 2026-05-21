using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.Data;
using Loginandregistrationpages.Api.DTOs.Auth;
using Loginandregistrationpages.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using BCrypt.Net;

namespace Loginandregistrationpages.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthService> _logger;

        public AuthService(AppDbContext db, IConfiguration config, ILogger<AuthService> logger)
        {
            _db = db;
            _config = config;
            _logger = logger;
        }

        public async Task<ApiResponse<RegisterResponse>> RegisterAsync(RegisterRequest request)
        {
            var usernameNorm = request.Username.Trim().ToLower();
            var emailNorm = request.Email.Trim().ToLower();
            if (await _db.Users.AnyAsync(u => u.Username.ToLower() == usernameNorm))
                return ApiResponse<RegisterResponse>.Fail("Username already exists");
            if (await _db.Users.AnyAsync(u => u.Email.ToLower() == emailNorm))
                return ApiResponse<RegisterResponse>.Fail("Email already in use");
            if (request.Password.Length < 8 || !request.Password.Any(char.IsUpper) || !request.Password.Any(char.IsLower) || !request.Password.Any(char.IsDigit))
                return ApiResponse<RegisterResponse>.Fail("Password must be at least 8 characters, contain an upper and lower case letter and a digit");
            if (request.Password != request.ConfirmPassword)
                return ApiResponse<RegisterResponse>.Fail("Passwords do not match");
            
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new ApplicationUser
            {
                Username = request.Username.Trim(),
                Email = request.Email.Trim(),
                PasswordHash = passwordHash
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            _logger.LogInformation($"New user created: {user.Id} ({user.Username})");
            var response = new RegisterResponse
            {
                UserId = user.Id.ToString(),
                Username = user.Username,
                Email = user.Email
            };
            return ApiResponse<RegisterResponse>.Ok(response, "Registration successful");
        }

        public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
        {
            var norm = request.UsernameOrEmail.Trim().ToLower();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == norm || u.Email.ToLower() == norm);
            if (user == null || user.IsDeleted)
                return ApiResponse<LoginResponse>.Fail("Invalid credentials");
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return ApiResponse<LoginResponse>.Fail("Invalid credentials");
            var token = JwtHelper.GenerateToken(user.Id, user.Username, user.Email, user.Role, _config);
            _logger.LogInformation($"User {user.Username} logged in.");
            var response = new LoginResponse
            {
                Token = token,
                UserId = user.Id.ToString(),
                Username = user.Username,
                Email = user.Email
            };
            return ApiResponse<LoginResponse>.Ok(response, "Login successful");
        }
    }
}
