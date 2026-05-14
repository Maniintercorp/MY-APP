using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentAssertions;
using MY_APP.Services;
using MY_APP.Repositories;
using MY_APP.DTOs;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using MY_APP.Models;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock = new Mock<IUserRepository>();
    private readonly Mock<ILogger<UserService>> _loggerMock = new Mock<ILogger<UserService>>();
    private readonly Mock<IConfiguration> _configurationMock = new Mock<IConfiguration>();
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _configurationMock.Setup(c => c["JwtConfig:Key"]).Returns("SuperSecretKey@345");
        _userService = new UserService(_userRepositoryMock.Object, _configurationMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldReturnNull_WhenUserNotFound()
    {
        // Arrange
        _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(It.IsAny<string>()))
            .ReturnsAsync((User)null);

        var loginRequest = new LoginRequestDto { Username = "unknown", Password = "password" };

        // Act
        var result = await _userService.AuthenticateAsync(loginRequest);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldReturnToken_WhenCredentialsAreValid()
    {
        // Arrange
        var user = new User { Username = "validuser", PasswordHash = new byte[] { 1, 2, 3 }, Salt = new byte[] { 1, 2, 3 } };
        _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(It.IsAny<string>()))
            .ReturnsAsync(user);

        var loginRequest = new LoginRequestDto { Username = "validuser", Password = "password" };

        // Act
        var result = await _userService.AuthenticateAsync(loginRequest);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.Message.Should().Be("Login successful.");
    }
}