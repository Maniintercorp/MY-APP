using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

public class UserControllerIntegrationTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly HttpClient _client;

    public UserControllerIntegrationTests(WebApplicationFactory<Startup> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetUsers_ShouldReturnOkResponse()
    {
        var response = await _client.GetAsync("/api/users");
        response.EnsureSuccessStatusCode();
        response.Content.Headers.ContentType.ToString().Should().Be("application/json; charset=utf-8");
    }
}