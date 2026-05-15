using Xunit;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using YourApp;
using System.Net.Http.Json;
using YourApp.Models;

public class UserControllerIntegrationTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly HttpClient _client;

    public UserControllerIntegrationTests(WebApplicationFactory<Startup> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task PostRegister_ShouldReturnCreated_WhenDataIsValid()
    {
        var newUser = new { Username = "newuser", Email = "new@example.com", Password = "password123" };

        var response = await _client.PostAsJsonAsync("/api/register", newUser);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var user = await response.Content.ReadFromJsonAsync<User>();
        user.Should().NotBeNull();
    }
}