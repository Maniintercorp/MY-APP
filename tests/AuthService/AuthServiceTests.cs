using Xunit;
using Moq;
using MyApp.Services;
using MyApp.Repositories;
using MyApp.DTOs;
using MyApp.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using FluentAssertions;
using System;
using System.Text;

namespace MyApp.Tests.AuthService
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<ILogger<AuthService>> _loggerMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _loggerMock = new Mock<ILogger<AuthService>>();
            _authService = new AuthService(_userRepositoryMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task AuthenticateUserAsync_ReturnsNull_WhenUserDoesNotExist()
        {
            // Arrange
            var loginDto = new LoginRequestDto { Email = "nonexistent@mail.com", Password = "password" };
            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User)null);

            // Act
            var result = await _authService.AuthenticateUserAsync(loginDto);

            // Assert
            result.Should().BeNull();
            _loggerMock.Verify(logger => logger.Log(
                It.Is<LogLevel>(l => l == LogLevel.Warning), It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => true), It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()
            ), Times.Once);
        }

        [Fact]
        public async Task AuthenticateUserAsync_ReturnsNull_WhenPasswordIsIncorrect()
        {
            // Arrange
            var user = new User
            {
                UserId = Guid.NewGuid(),
                Email = "user@mail.com",
                PasswordHash = new HMACSHA512().ComputeHash(Encoding.UTF8.GetBytes("correctPass"))
            };
            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(user.Email))
                .ReturnsAsync(user);

            var loginDto = new LoginRequestDto { Email = user.Email, Password = "wrongPass" };

            // Act
            var result = await _authService.AuthenticateUserAsync(loginDto);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task AuthenticateUserAsync_ReturnsToken_WhenCredentialsAreValid()
        {
            // Arrange
            var user = new User
            {
                UserId = Guid.NewGuid(),
                Email = "user@mail.com",
                PasswordHash = new HMACSHA512().ComputeHash(Encoding.UTF8.GetBytes("testPassword"))
            };
            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(user.Email))
                .ReturnsAsync(user);

            var loginDto = new LoginRequestDto { Email = user.Email, Password = "testPassword" };

            // Act
            var result = await _authService.AuthenticateUserAsync(loginDto);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().NotBeNullOrEmpty();
            result.UserId.Should().Be(user.UserId.ToString());
        }
    }
}
