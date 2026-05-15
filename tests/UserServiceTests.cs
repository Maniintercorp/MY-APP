using Xunit;
using Moq;
using FluentAssertions;
using MyApplication.Services;
using MyApplication.Repositories;

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
    public async Task GetUserById_ShouldReturnUser_WhenUserExists()
    {
        var userId = 1;
        var user = new User { Id = userId, Username = "testuser", Email = "testuser@example.com" };
        _userRepositoryMock.Setup(repo => repo.GetUserByIdAsync(userId)).ReturnsAsync(user);

        var result = await _userService.GetUserByIdAsync(userId);

        result.Should().NotBeNull();
        result.Username.Should().Be("testuser");
    }

    [Fact]
    public async Task GetUserById_ShouldReturnNull_WhenUserDoesNotExist()
    {
        var userId = 1;
        _userRepositoryMock.Setup(repo => repo.GetUserByIdAsync(userId)).ReturnsAsync((User)null);

        var result = await _userService.GetUserByIdAsync(userId);

        result.Should().BeNull();
    }
}