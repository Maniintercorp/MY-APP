// Unit tests for UserService
using Xunit;
using Moq;
using FluentAssertions;

public class UserServiceTests
{
  [Fact]
  public void GetUserById_ShouldReturnUser_WhenUserIdExists()
  {
    // Arrange
    var mockUserRepository = new Mock<IUserRepository>();
    mockUserRepository.Setup(repo => repo.GetUserById(It.IsAny<int>()))
      .ReturnsAsync(new User { Id = 1, Username = "testUser" });

    var userService = new UserService(mockUserRepository.Object);

    // Act
    var user = await userService.GetUserById(1);

    // Assert
    user.Should().NotBeNull();
    user.Username.Should().Be("testUser");
  }

  [Fact]
  public void RegisterUser_ShouldCreateNewUser_WhenValidDataPassed()
  {
    var mockUserRepository = new Mock<IUserRepository>();
    var userService = new UserService(mockUserRepository.Object);
    
    var newUser = new User { Username = "newUser", Email = "newUser@example.com" };
    
    var result = userService.RegisterUser(newUser);
    
    mockUserRepository.Verify(repo => repo.Add(It.Is<User>(u => u.Username == "newUser")), Times.Once);
  }
}
