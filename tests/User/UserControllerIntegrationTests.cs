using Xunit;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using MyApplication;

public class UserControllerIntegrationTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly WebApplicationFactory<Startup> _factory;

    public UserControllerIntegrationTests(WebApplicationFactory<Startup> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Post_LoginUser_ShouldReturn_Ok_When_CredentialsAreValid()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsync("/api/login", new JsonContent(new
        {
            Username = "testuser",
            Password = "testpassword"
        }));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
