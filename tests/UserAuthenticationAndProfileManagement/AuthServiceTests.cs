using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentAssertions;
using YourApp.DTOs;
using YourApp.Services;
using YourApp.Repositories;
using YourApp.Models;
using Microsoft.Extensions.Logging;
using AutoMapper;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<ILogger<AuthService>> _loggerMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _mapperMock = new Mock<IMapper>();
        _loggerMock = new Mock<ILogger<AuthService>>();
        _authService = new AuthService(_userRepositoryMock.Object, _mapperMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task RegisterAsync_ShouldReturnRegisterResponseDto_WhenRegistrationIsSuccessful()
    {
        // Arrange
        var registerRequest = new RegisterRequestDto { Email = "test@example.com", Password = "Password123", Username = "testuser" };
        var user = new User {
            UserId = Guid.NewGuid(),
            Email = "test@example.com",
            PasswordHash = "hashedPassword",
            Username = "testuser"
        };

        _mapperMock.Setup(m => m.Map<User>(registerRequest)).Returns(user);
        _mapperMock.Setup(m => m.Map<RegisterResponseDto>(user)).Returns(new RegisterResponseDto {
            UserId = user.UserId.ToString(),
            Email = user.Email,
            Username = user.Username
        });

        _userRepositoryMock.Setup(u => u.AddUserAsync(It.IsAny<User>())).ReturnsAsync(true);

        // Act
        var result = await _authService.RegisterAsync(registerRequest);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be("test@example.com");
        result.Username.Should().Be("testuser");
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnToken_WhenCredentialsAreValid()
    {
        // Arrange
        var loginRequest = new LoginRequestDto { Email = "test@example.com", Password = "Password123" };
        var user = new User {
            Email = "test@example.com",
            PasswordHash = "hashedPassword"
        };

        _userRepositoryMock.Setup(u => u.GetUserByEmailAsync(loginRequest.Email)).ReturnsAsync(user);

        // Act
        var token = await _authService.LoginAsync(loginRequest);

        // Assert
        token.Should().NotBeNull();
    }
}