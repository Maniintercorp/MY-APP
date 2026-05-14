using Xunit;
using MyApp.Controllers;
using MyApp.Services;
using Microsoft.AspNetCore.Mvc;
using MyApp.DTOs;
using Moq;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using FluentAssertions;

namespace MyApp.Tests.AuthController
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _authServiceMock;
        private readonly Mock<ILogger<AuthController>> _loggerMock;
        private readonly AuthController _authController;

        public AuthControllerTests()
        {
            _authServiceMock = new Mock<IAuthService>();
            _loggerMock = new Mock<ILogger<AuthController>>();
            _authController = new AuthController(_authServiceMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task Login_ReturnsBadRequest_WhenAuthenticationFails()
        {
            // Arrange
            var loginRequest = new LoginRequestDto { Email = "invalid@mail.com", Password = "wrongPass" };
            _authServiceMock.Setup(service => service.AuthenticateUserAsync(loginRequest))
                .ReturnsAsync((LoginResponseDto)null);

            // Act
            var result = await _authController.Login(loginRequest) as BadRequestObjectResult;

            // Assert
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(400);
            result.Value.Should().Be("Invalid login attempt.");
        }

        [Fact]
        public async Task Login_ReturnsOkResult_WhenAuthenticationSucceeds()
        {
            // Arrange
            var loginRequest = new LoginRequestDto { Email = "valid@mail.com", Password = "correctPass" };
            var response = new LoginResponseDto { Token = "validToken", UserId = "123" };

            _authServiceMock.Setup(service => service.AuthenticateUserAsync(loginRequest))
                .ReturnsAsync(response);

            // Act
            var result = await _authController.Login(loginRequest) as OkObjectResult;

            // Assert
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(200);
            result.Value.Should().BeEquivalentTo(response);
        }
    }
}
