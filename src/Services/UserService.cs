using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using MyProject.DTOs;
using MyProject.Models;
using MyProject.Repositories;

namespace MyProject.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, IMapper mapper, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<UserRegistrationResponse> RegisterUserAsync(UserRegistrationRequest request)
        {
            var user = _mapper.Map<User>(request);
            user.UserId = Guid.NewGuid();
            user.PasswordHash = HashPassword(request.Password);
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.AddUserAsync(user);

            return new UserRegistrationResponse
            {
                UserId = user.UserId,
                Message = "User registered successfully"
            };
        }

        public async Task<UserLoginResponse> AuthenticateUserAsync(UserLoginRequest request)
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email);
            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            {
                return null;
            }

            var token = GenerateJwtToken(user);

            return new UserLoginResponse
            {
                Token = token,
                Message = "Login successful"
            };
        }

        public async Task<UserProfileUpdateResponse> UpdateUserProfileAsync(UserProfileUpdateRequest request)
        {
            var user = await _userRepository.GetUserByIdAsync(request.UserId);
            if (user == null)
            {
                return null;
            }

            user.Username = request.Username;
            user.Email = request.Email;
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                user.PasswordHash = HashPassword(request.Password);
            }
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateUserAsync(user);

            return new UserProfileUpdateResponse
            {
                Message = "Profile updated successfully"
            };
        }

        private byte[] HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            return sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private bool VerifyPassword(string password, byte[] passwordHash)
        {
            var computedHash = HashPassword(password);
            return computedHash.Length == passwordHash.Length &&
                   computedHash.AsSpan().SequenceEqual(passwordHash);
        }

        private string GenerateJwtToken(User user)
        {
            // JWT token generation logic
            return "token";
        }
    }

    public interface IUserService
    {
        Task<UserRegistrationResponse> RegisterUserAsync(UserRegistrationRequest request);
        Task<UserLoginResponse> AuthenticateUserAsync(UserLoginRequest request);
        Task<UserProfileUpdateResponse> UpdateUserProfileAsync(UserProfileUpdateRequest request);
    }
}