using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

public class UserControllerTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly WebApplicationFactory<Startup> _factory;

    public UserControllerTests(WebApplicationFactory<Startup> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetUser_ShouldReturnUser_WhenUserExists()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/user/1");

        response.EnsureSuccessStatusCode();
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetUser_ShouldReturnNotFound_WhenUserDoesNotExist()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/user/999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}