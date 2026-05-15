using Xunit;
using Moq;
using FluentAssertions;
using MyApplication.Services;
using MyApplication.Repositories;

public class UserServiceTests {
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly UserService _userService;

    public UserServiceTests() {
        _userRepositoryMock = new Mock<IUserRepository>();
        _userService = new UserService(_userRepositoryMock.Object);
    }

    [Fact]
    public void RegisterUser_ShouldCallAddOnRepository_WhenDataIsValid() {
        // Arrange
        var user = new User { Username = "test", PasswordHash = "hash", Email = "test@example.com" };

        // Act
        _userService.RegisterUser(user);

        // Assert
        _userRepositoryMock.Verify(repo => repo.Add(user), Times.Once);
    }

    [Fact]
    public void RegisterUser_ShouldThrowException_WhenUserAlreadyExists() {
        // Arrange
        var user = new User { Username = "test", PasswordHash = "hash", Email = "test@example.com" };
        _userRepositoryMock.Setup(repo => repo.FindByEmail(user.Email)).Returns(user);

        // Act
        Action act = () => _userService.RegisterUser(user);

        // Assert
        act.Should().Throw<Exception>().WithMessage("User already exists");
    }
}