using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using YourApp.DTOs;
using YourApp.Repositories;
using YourApp.Models;
using AutoMapper;
using YourApp.Utilities;

namespace YourApp.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUserRepository userRepository, IMapper mapper, ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto registerRequestDto)
        {
            var user = _mapper.Map<User>(registerRequestDto);
            user.UserId = Guid.NewGuid();
            user.PasswordHash = PasswordHasher.HashPassword(registerRequestDto.Password);
            user.CreatedAt = DateTime.UtcNow;

            var result = await _userRepository.AddUserAsync(user);
            if (!result)
            {
                _logger.LogError("User registration failed for {Email}", registerRequestDto.Email);
                return null;
            }

            return _mapper.Map<RegisterResponseDto>(user);
        }

        public async Task<string> LoginAsync(LoginRequestDto loginRequestDto)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginRequestDto.Email);
            if (user == null || !PasswordHasher.VerifyPassword(loginRequestDto.Password, user.PasswordHash))
            {
                _logger.LogWarning("Invalid login attempt for {Email}", loginRequestDto.Email);
                return null;
            }

            return TokenGenerator.GenerateToken(user);
        }
    }
}