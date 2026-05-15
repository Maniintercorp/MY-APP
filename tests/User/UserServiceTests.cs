using Xunit;
using Moq;
using FluentAssertions;
using MyApp.Services;
using MyApp.Repositories;

public class UserServiceTests
{
    private readonly UserService _userService;
    private readonly Mock<IUserRepository> _userRepoMock;

    public UserServiceTests()
    {
        _userRepoMock = new Mock<IUserRepository>();
        _userService = new UserService(_userRepoMock.Object);
    }

    [Fact]
    public void CreateUser_ShouldInvokeRepositoryAdd()
    {
        var user = new User { Email = "test@example.com" };
        _userService.CreateUser(user);
        _userRepoMock.Verify(repo => repo.Add(It.Is<User>(u => u.Email == user.Email)), Times.Once);
    }
}