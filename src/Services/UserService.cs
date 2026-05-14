using System.Threading.Tasks;
using MY_APP.DTOs;
using MY_APP.Repositories;
using MY_APP.Models;
using MY_APP.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace MY_APP.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, IJwtTokenService jwtTokenService, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _jwtTokenService = jwtTokenService;
            _logger = logger;
        }

        public async Task<LoginResponseDto> AuthenticateAsync(LoginRequestDto loginRequest)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginRequest.Email);

            if (user == null || !VerifyPassword(loginRequest.Password, user.PasswordHash))
            {
                _logger.LogWarning("Invalid login attempt for email: {Email}", loginRequest.Email);
                return null;
            }

            var token = _jwtTokenService.GenerateToken(user);
            var refreshToken = _jwtTokenService.GenerateRefreshToken();

            return new LoginResponseDto
            {
                Token = token,
                ExpiresIn = 3600, // Example expiration time (1 hour)
                RefreshToken = refreshToken
            };
        }

        private bool VerifyPassword(string password, byte[] passwordHash)
        {
            // Implement your password verification logic here
            // This is just a placeholder	
            return true;
        }
    }
}
