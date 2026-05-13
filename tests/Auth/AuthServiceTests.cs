using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using MY_APP.DTOs;
using MY_APP.Models;
using MY_APP.Repositories;
using MY_APP.Services;
using Xunit;

namespace MY_APP.Tests
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
        public async Task AuthenticateAsync_ShouldReturnToken_WhenCredentialsAreValid()
        {
            // Arrange
            var userLoginDTO = new UserLoginDTO { Username = "validUser", Password = "validPass" };
            _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(userLoginDTO.Username))
                .ReturnsAsync(new User { Username = "validUser", PasswordHash = "validPass" });

            // Act
            var result = await _authService.AuthenticateAsync(userLoginDTO);

            // Assert
            result.Success.Should().BeTrue();
            result.Token.Should().NotBeNull();
        }

        [Fact]
        public async Task AuthenticateAsync_ShouldReturnError_WhenCredentialsAreInvalid()
        {
            // Arrange
            var userLoginDTO = new UserLoginDTO { Username = "invalidUser", Password = "invalidPass" };
            _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(userLoginDTO.Username))
                .ReturnsAsync((User)null);

            // Act
            var result = await _authService.AuthenticateAsync(userLoginDTO);

            // Assert
            result.Success.Should().BeFalse();
            result.Error.Should().Be("Invalid username or password.");
        }
    }
}