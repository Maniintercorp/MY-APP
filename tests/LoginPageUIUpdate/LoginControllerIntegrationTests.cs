using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using LoginPageUIUpdate;
using LoginPageUIUpdate.Types;

public class LoginControllerIntegrationTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly WebApplicationFactory<Startup> _factory;

    public LoginControllerIntegrationTests(WebApplicationFactory<Startup> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Post_Login_ShouldReturnOk_WithValidCredentials()
    {
        // Arrange
        var client = _factory.CreateClient();
        var loginRequest = new LoginRequest { Email = "test@example.com", Password = "password", RememberMe = false };

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
        loginResponse.Should().NotBeNull();
        loginResponse.User.Id.Should().BeEquivalentTo("user123");
    }

    [Fact]
    public async Task Post_Login_ShouldReturnUnauthorized_WithInvalidCredentials()
    {
        // Arrange
        var client = _factory.CreateClient();
        var loginRequest = new LoginRequest { Email = "wrong@example.com", Password = "wrongpassword", RememberMe = false };

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}