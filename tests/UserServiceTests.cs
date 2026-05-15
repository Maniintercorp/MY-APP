using Xunit;
using Moq;
using MyApp.Services;
using MyApp.Repositories;
using FluentAssertions;

public class UserServiceTests {
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly UserService _userService;

    public UserServiceTests() {
        _userRepositoryMock = new Mock<IUserRepository>();
        _userService = new UserService(_userRepositoryMock.Object);
    }

    [Fact]
    public void Should_RegisterUser_Successfully() {
        // Arrange
        var userModel = new UserModel {
            Username = "testuser",
            Email = "test@example.com"
        };

        _userRepositoryMock.Setup(repo => repo.AddUser(It.IsAny<UserModel>())).ReturnsAsync(true);
        
        // Act
        var result = await _userService.Register(userModel);

        // Assert
        result.Should().BeTrue();
        _userRepositoryMock.Verify(repo => repo.AddUser(It.Is<UserModel>(user => user.Email == "test@example.com")), Times.Once);
    }

    [Fact]
    public void Should_FailToRegister_UserWhenEmailExists() {
        // Arrange
        var userModel = new UserModel {
            Username = "existinguser",
            Email = "exist@example.com"
        };

        _userRepositoryMock.Setup(repo => repo.AddUser(It.IsAny<UserModel>())).Throws(new DuplicateEmailException());
        
        // Act
        Func<Task> act = async () => await _userService.Register(userModel);

        // Assert
        await act.Should().ThrowAsync<DuplicateEmailException>();
    }
}