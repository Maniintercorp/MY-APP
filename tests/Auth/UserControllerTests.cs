using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using MY_APP.Controllers;
using MY_APP.Services.Interfaces;
using MY_APP.DTOs;
using Xunit;
using FluentAssertions;
using Microsoft.Extensions.Logging;

namespace tests.Auth
{
    public class UserControllerTests
    {
        private readonly Mock<IUserService> _userServiceMock;
        private readonly Mock<ILogger<UserController>> _loggerMock;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            _userServiceMock = new Mock<IUserService>();
            _loggerMock = new Mock<ILogger<UserController>>();
            _controller = new UserController(_userServiceMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task Login_ShouldReturnOk_WhenCredentialsAreValid()
        {
            // Arrange
            var loginRequest = new LoginRequestDto { Email = "valid@example.com", Password = "validpassword" };
            var loginResponse = new LoginResponseDto { Token = "token", ExpiresIn = 3600, RefreshToken = "refreshToken" };

            _userServiceMock.Setup(service => service.AuthenticateAsync(loginRequest))
                            .ReturnsAsync(loginResponse);

            // Act
            var result = await _controller.Login(loginRequest);

            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult.Value.Should().BeEquivalentTo(loginResponse);
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenCredentialsAreInvalid()
        {
            // Arrange
            var loginRequest = new LoginRequestDto { Email = "invalid@example.com", Password = "invalidpassword" };

            _userServiceMock.Setup(service => service.AuthenticateAsync(loginRequest))
                            .ReturnsAsync((LoginResponseDto)null);

            // Act
            var result = await _controller.Login(loginRequest);

            // Assert
            result.Should().BeOfType<UnauthorizedResult>();
        }
    }
}
