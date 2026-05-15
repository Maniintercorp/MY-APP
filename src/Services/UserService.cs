using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using DTOs;
using Repositories;
using Models;
using AutoMapper;
using Validators;
using Microsoft.Extensions.Options;
using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, IRefreshTokenRepository refreshTokenRepository, IMapper mapper, IConfiguration configuration, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _mapper = mapper;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<LoginResponseDto> LoginWithEmailAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginDto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return null;
            }

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            await _refreshTokenRepository.CreateRefreshTokenAsync(new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpirationDate = DateTime.UtcNow.AddDays(7)
            });

            return new LoginResponseDto
            {
                Token = token,
                RefreshToken = refreshToken
            };
        }
    }
}
