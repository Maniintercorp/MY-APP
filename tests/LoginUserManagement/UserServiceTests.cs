using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentAssertions;
using Services;
using DTOs;
using Repositories;
using Models;
using AutoMapper;
using Microsoft.Extensions.Logging;

namespace Tests.LoginUserManagement
{
    public class UserServiceTests
    {
        private readonly UserService _userService;
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IRefreshTokenRepository> _mockRefreshTokenRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ILogger<UserService>> _mockLogger;

        public UserServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockRefreshTokenRepository = new Mock<IRefreshTokenRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockLogger = new Mock<ILogger<UserService>>();
            _userService = new UserService(
                _mockUserRepository.Object,
                _mockRefreshTokenRepository.Object,
                _mockMapper.Object,
                Mock.Of<IConfiguration>(),
                _mockLogger.Object);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenUserNotFound()
        {
            var loginDto = new LoginDto { Username = "nonexistent", Password = "invalid" };
            _mockUserRepository.Setup(repo => repo.GetUserByUsernameAsync(It.IsAny<string>()))
                               .ReturnsAsync((User)null);

            var result = await _userService.LoginAsync(loginDto);

            result.Should().BeNull();
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnToken_WhenUserIsFoundAndPasswordCorrect()
        {
            var loginDto = new LoginDto { Username = "existent", Password = "correct" };
            var user = new User { UserId = 1, Username = "existent", PasswordHash = BCrypt.Net.BCrypt.HashPassword("correct") };

            _mockUserRepository.Setup(repo => repo.GetUserByUsernameAsync(loginDto.Username))
                               .ReturnsAsync(user);

            var result = await _userService.LoginAsync(loginDto);

            result.Should().NotBeNull();
            result.Token.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnSuccess_WhenUserIsNotFound()
        {
            var registerDto = new RegisterDto { Username = "newuser", Password = "secure", Email = "email@test.com" };
            _mockUserRepository.Setup(repo => repo.GetUserByUsernameAsync(It.IsAny<string>()))
                               .ReturnsAsync((User)null);
            
            var result = await _userService.RegisterAsync(registerDto);

            result.Success.Should().BeTrue();
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnFailure_WhenUserAlreadyExists()
        {
            var registerDto = new RegisterDto { Username = "existuser", Password = "secure", Email = "exist@test.com" };
            _mockUserRepository.Setup(repo => repo.GetUserByUsernameAsync(registerDto.Username))
                               .ReturnsAsync(new User());
            
            var result = await _userService.RegisterAsync(registerDto);

            result.Success.Should().BeFalse();
            result.Message.Should().Be("User already exists.");
        }
    }
}
