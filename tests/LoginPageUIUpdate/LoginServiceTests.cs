using Moq;
using Xunit;
using FluentAssertions;
using LoginPageUIUpdate.Services;
using LoginPageUIUpdate.Types;

public class LoginServiceTests
{
    private readonly Mock<IApiClient> _apiClientMock;
    private readonly LoginService _loginService;

    public LoginServiceTests()
    {
        _apiClientMock = new Mock<IApiClient>();
        _loginService = new LoginService(_apiClientMock.Object);
    }

    [Fact]
    public async Task LoginUser_ShouldReturnLoginResponse_WhenApiCallIsSuccessful()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "test@example.com",
            Password = "password",
            RememberMe = true
        };

        var expectedResponse = new LoginResponse
        {
            Token = "fake-token",
            ExpiresIn = 3600,
            User = new User { Id = "user123", Name = "Test User" }
        };

        _apiClientMock.Setup(client => client.PostAsync<LoginResponse>(It.IsAny<string>(), It.IsAny<LoginRequest>()))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _loginService.LoginUser(loginRequest);

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task LoginUser_ShouldThrowException_WhenApiCallFails()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "test@example.com",
            Password = "password",
            RememberMe = true
        };

        _apiClientMock.Setup(client => client.PostAsync<LoginResponse>(It.IsAny<string>(), It.IsAny<LoginRequest>()))
            .ThrowsAsync(new HttpRequestException("Request failed"));

        // Act & Assert
        await FluentActions.Invoking(() => _loginService.LoginUser(loginRequest))
            .Should().ThrowAsync<HttpRequestException>().WithMessage("Request failed");
    }
}
