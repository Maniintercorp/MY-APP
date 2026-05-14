using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentAssertions;
using MY_APP.Services;
using MY_APP.Services.Interfaces;
using MY_APP.Repositories.Interfaces;
using MY_APP.DTOs;
using MY_APP.Models;
using Microsoft.Extensions.Logging;

namespace tests.Auth
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IJwtTokenService> _jwtTokenServiceMock;
        private readonly Mock<ILogger<UserService>> _loggerMock;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _jwtTokenServiceMock = new Mock<IJwtTokenService>();
            _loggerMock = new Mock<ILogger<UserService>>();
            _userService = new UserService(_userRepositoryMock.Object, _jwtTokenServiceMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task AuthenticateAsync_ShouldReturnToken_WhenUserIsValid()
        {
            // Arrange
            var userEmail = "test@example.com";
            var userPassword = "validpassword";

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(userEmail))
                               .ReturnsAsync(new User { UserId = 1, Email = userEmail, PasswordHash = new byte[0] });

            _jwtTokenServiceMock.Setup(service => service.GenerateToken(It.IsAny<User>()))
                                .Returns("token");

            _jwtTokenServiceMock.Setup(service => service.GenerateRefreshToken())
                                .Returns("refreshToken");

            // Act
            var result = await _userService.AuthenticateAsync(new LoginRequestDto { Email = userEmail, Password = userPassword });

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().Be("token");
            result.RefreshToken.Should().Be("refreshToken");
        }

        [Fact]
        public async Task AuthenticateAsync_ShouldReturnNull_WhenUserIsInvalid()
        {
            // Arrange
            var userEmail = "invalid@example.com";
            var userPassword = "invalidpassword";

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(userEmail))
                               .ReturnsAsync((User)null);

            // Act
            var result = await _userService.AuthenticateAsync(new LoginRequestDto { Email = userEmail, Password = userPassword });

            // Assert
            result.Should().BeNull();
        }
    }
}
