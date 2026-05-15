using Moq;
using Xunit;
using FluentAssertions;
using YourApp.Services;
using YourApp.Repositories;

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
    public void RegisterUser_ShouldCreateUser_WhenDataIsValid()
    {
        // Arrange
        var newUser = new User { Username = "test", Email = "test@example.com", PasswordHash = "hashedpassword" };
        _userRepositoryMock.Setup(repo => repo.AddUser(It.IsAny<User>())).ReturnsAsync(newUser);

        // Act
        var result = _userService.RegisterUser(newUser);

        // Assert
        result.Should().NotBeNull();
        result.Username.Should().Be("test");
        _userRepositoryMock.Verify(repo => repo.AddUser(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public void RegisterUser_ShouldThrowException_WhenUserAlreadyExists()
    {
        // Arrange
        var existingUser = new User { Username = "test", Email = "test@example.com", PasswordHash = "hashedpassword" };
        _userRepositoryMock.Setup(repo => repo.GetUserByEmail(It.IsAny<string>())).ReturnsAsync(existingUser);

        // Act
        Func<Task> act = async () => { await _userService.RegisterUser(existingUser); };

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>();
        _userRepositoryMock.Verify(repo => repo.AddUser(It.IsAny<User>()), Times.Never);
    }
}