using Xunit;
using Moq;
using FluentAssertions;
using MyApplication.Services;
using MyApplication.Models;

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
    public async Task RegisterUser_Should_Return_ValidUser_When_Successful()
    {
        var user = new User { Username = "test", Password = "hashed-pwd", Email = "test@example.com" };
        _userRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<User>())).ReturnsAsync(user);

        var result = await _userService.RegisterUserAsync(user);

        result.Should().NotBeNull();
        result.Username.Should().Be(user.Username);
    }
}
