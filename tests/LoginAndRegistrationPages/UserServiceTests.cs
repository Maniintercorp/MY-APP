using Xunit;
using Moq;
using FluentAssertions;
using YourNamespaceHere.Services;
using YourNamespaceHere.Models;
using YourNamespaceHere.Data;

namespace YourNamespaceHere.Tests
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _userService = new UserService(_userRepositoryMock.Object);
        }

        [Fact]
        public void RegisterUser_ShouldReturnUser_WhenUserIsRegistered()
        {
            // Arrange
            var newUser = new User { Username = "newuser", Email = "newuser@example.com", PasswordHash = "hashed" };
            _userRepositoryMock.Setup(repo => repo.CreateUser(It.IsAny<User>())).ReturnsAsync(newUser);

            // Act
            var result = _userService.RegisterUser(newUser);

            // Assert
            result.Should().NotBeNull();
            result.Username.Should().Be("newuser");
            _userRepositoryMock.Verify(repo => repo.CreateUser(It.IsAny<User>()), Times.Once);
        }

        [Fact]
        public void AuthenticateUser_ShouldReturnUser_WhenCredentialsAreCorrect()
        {
            // Arrange
            var user = new User { Username = "user", PasswordHash = "hashed" };
            _userRepositoryMock.Setup(repo => repo.AuthenticateUser(user.Username, user.PasswordHash)).ReturnsAsync(user);

            // Act
            var result = _userService.AuthenticateUser(user.Username, user.PasswordHash);

            // Assert
            result.Should().NotBeNull();
            result.Username.Should().Be("user");
            _userRepositoryMock.Verify(repo => repo.AuthenticateUser(user.Username, user.PasswordHash), Times.Once);
        }
    }
}