using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using MyProject.DTOs;
using MyProject.Services;
using MyProject.Models;
using MyProject.Repositories;
using Xunit;
using FluentAssertions;

namespace MyProject.Tests
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ILogger<UserService>> _loggerMock;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILogger<UserService>>();
            _userService = new UserService(_userRepositoryMock.Object, _mapperMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task RegisterUserAsync_ShouldRegisterUserSuccessfully()
        {
            var userRequest = new UserRegistrationRequest
            {
                Username = "testuser",
                Email = "test@example.com",
                Password = "password"
            };
            var user = new User { UserId = Guid.NewGuid(), Username = "testuser", Email = "test@example.com" };

            _mapperMock.Setup(m => m.Map<User>(It.IsAny<UserRegistrationRequest>())).Returns(user);
            _userRepositoryMock.Setup(r => r.AddUserAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

            var result = await _userService.RegisterUserAsync(userRequest);

            result.Message.Should().Be("User registered successfully");
            _userRepositoryMock.Verify(r => r.AddUserAsync(It.IsAny<User>()), Times.Once);
        }

        [Fact]
        public async Task AuthenticateUserAsync_ShouldReturnTokenOnValidCredentials()
        {
            var loginRequest = new UserLoginRequest
            {
                Email = "test@example.com",
                Password = "password"
            };

            var user = new User { UserId = Guid.NewGuid(), Email = "test@example.com", PasswordHash = _userService.HashPassword("password") };

            _userRepositoryMock.Setup(r => r.GetUserByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);

            var result = await _userService.AuthenticateUserAsync(loginRequest);

            result.Token.Should().NotBeNullOrEmpty();
            result.Message.Should().Be("Login successful");
        }

        [Fact]
        public async Task UpdateUserProfileAsync_ShouldUpdateProfileSuccessfully()
        {
            var updateRequest = new UserProfileUpdateRequest
            {
                UserId = Guid.NewGuid(),
                Username = "newusername",
                Email = "newemail@example.com",
                Password = "newpassword"
            };
            var user = new User { UserId = updateRequest.UserId };

            _userRepositoryMock.Setup(r => r.GetUserByIdAsync(It.IsAny<Guid>())).ReturnsAsync(user);
            _userRepositoryMock.Setup(r => r.UpdateUserAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

            var result = await _userService.UpdateUserProfileAsync(updateRequest);

            result.Message.Should().Be("Profile updated successfully");
            _userRepositoryMock.Verify(r => r.UpdateUserAsync(It.IsAny<User>()), Times.Once);
        }
    }
}
