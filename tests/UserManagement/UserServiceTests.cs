using Xunit;
using Moq;
using FluentAssertions;
using YourApp.Services;
using YourApp.Models;

public class UserServiceTests
{
    private readonly UserService _userService;
    private readonly Mock<IUserRepository> _userRepositoryMock;

    public UserServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _userService = new UserService(_userRepositoryMock.Object);
    }

    [Fact]
    public void RegisterUser_ShouldReturnSuccess_WhenUserIsValid()
    {
        var newUser = new User { Username = "newuser", Email = "new@example.com", PasswordHash = "hashedpwd" };

        _userRepositoryMock.Setup(repo => repo.Add(It.IsAny<User>())).Returns(newUser);

        var result = _userService.RegisterUser(newUser);

        result.Should().NotBeNull();
        result.Username.Should().Be("newuser");
    }
}