using System.Threading.Tasks;
using Moq;
using Xunit;
using FluentAssertions;
using MY_APP.Services;
using MY_APP.Repositories;
using MY_APP.DTOs;
using MY_APP.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ILogger<AuthService>> _loggerMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _loggerMock = new Mock<ILogger<AuthService>>();
        _configurationMock = new Mock<IConfiguration>();
        _authService = new AuthService(_userRepositoryMock.Object, _loggerMock.Object, _configurationMock.Object);
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(It.IsAny<string>())).ReturnsAsync((User)null);
        var loginRequest = new LoginRequestDto { Username = "user", Password = "pass" };

        // Act
        var result = await _authService.AuthenticateAsync(loginRequest);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldReturnResponse_WhenUserExistsAndPasswordMatches()
    {
        // Arrange
        var user = new User { UserId = 1, Username = "user", PasswordHash = "pass" };
        _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(user.Username)).ReturnsAsync(user);
        _authService.VerifyPasswordHash = (password, hash) => password == hash; // Mock VerifyPasswordHash
        _configurationMock.Setup(config => config["Jwt:Key"]).Returns("test_key");

        var loginRequest = new LoginRequestDto { Username = "user", Password = "pass" };

        // Act
        var result = await _authService.AuthenticateAsync(loginRequest);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldReturnNull_WhenPasswordDoesNotMatch()
    {
        // Arrange
        var user = new User { UserId = 1, Username = "user", PasswordHash = "pass" };
        _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(user.Username)).ReturnsAsync(user);
        _authService.VerifyPasswordHash = (password, hash) => password != hash; // Mock VerifyPasswordHash

        var loginRequest = new LoginRequestDto { Username = "user", Password = "wrong_pass" };

        // Act
        var result = await _authService.AuthenticateAsync(loginRequest);

        // Assert
        result.Should().BeNull();
    }
}