using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Threading.Tasks;

public class UserApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>> {
    private readonly WebApplicationFactory<Program> _factory;

    public UserApiIntegrationTests(WebApplicationFactory<Program> factory) {
        _factory = factory;
    }

    [Fact]
    public async Task Post_Login_ShouldReturnOk_WhenCredentialsAreValid() {
        // Arrange
        var client = _factory.CreateClient();
        var loginModel = new {
            Email = "testuser@example.com",
            Password = "password123"
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/login", loginModel);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Post_Login_ShouldReturnUnauthorized_WhenCredentialsAreInvalid() {
        // Arrange
        var client = _factory.CreateClient();
        var loginModel = new {
            Email = "invaliduser@example.com",
            Password = "wrongpassword"
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/login", loginModel);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}