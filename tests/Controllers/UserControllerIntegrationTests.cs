using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using MyApplication;
using Xunit;

public class UserControllerIntegrationTests : IClassFixture<WebApplicationFactory<Startup>> {
    private readonly HttpClient _client;

    public UserControllerIntegrationTests(WebApplicationFactory<Startup> factory) {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Login_ShouldReturnToken_WhenCredentialsAreValid() {
        // Arrange
        var payload = new { Username = "user", Password = "password" };
        
        // Act
        var response = await _client.PostAsJsonAsync("/api/users/login", payload);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadAsAsync<dynamic>();
        Assert.NotNull(content.token);
    }

    [Fact]
    public async Task Register_ShouldReturnBadRequest_WhenUserAlreadyExists() {
        // Arrange
        var payload = new { Username = "existingUser", Password = "password", Email = "test@example.com" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/users/register", payload);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}