using Moq;
using Xunit;
using FluentAssertions;
using MyApp.Services;
using MyApp.Repositories;
using Microsoft.Extensions.Logging;
using MyApp.DTOs;
using MyApp.Models;
using System.Threading.Tasks;

namespace MyApp.UnitTests
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock = new Mock<IUserRepository>();
        private readonly Mock<ILogger<UserService>> _loggerMock = new Mock<ILogger<UserService>>();
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _userService = new UserService(_userRepositoryMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task AuthenticateAsync_ShouldReturnToken_WhenCredentialsAreValid()
        {
            // Arrange
            var userLogin = new UserLoginDTO { Email = "test@example.com", Password = "password" };
            var user = new User { UserId = 1, Email = "test@example.com", PasswordHash = "hashedpassword" };

            _userRepositoryMock.Setup(repo => repo.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);

            // Act
            var (token, userId, error) = await _userService.AuthenticateAsync(userLogin);

            // Assert
            token.Should().NotBeNullOrEmpty();
            userId.Should().Be(1);
            error.Should().BeNull();
        }

        [Fact]
        public async Task AuthenticateAsync_ShouldReturnError_WhenUserNotExists()
        {
            // Arrange
            var userLogin = new UserLoginDTO { Email = "nonexistent@example.com", Password = "password" };
            _userRepositoryMock.Setup(repo => repo.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync((User)null);

            // Act
            var (token, userId, error) = await _userService.AuthenticateAsync(userLogin);

            // Assert
            token.Should().BeNull();
            userId.Should().Be(0);
            error.Should().Be("Invalid credentials.");
        }
    }
}
