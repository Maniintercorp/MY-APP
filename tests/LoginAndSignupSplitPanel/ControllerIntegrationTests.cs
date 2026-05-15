using Xunit;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using YourNamespace;

public class AuthenticationControllerTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly WebApplicationFactory<Startup> _factory;

    public AuthenticationControllerTests(WebApplicationFactory<Startup> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Post_Signup_Should_Return_Ok_Response()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsync("/api/auth/signup", new StringContent(
            "{ \"Name\": \"John Doe\", \"Email\": \"johndoe@example.com\", \"Password\": \"StrongPassword123!\" }",
            Encoding.UTF8, "application/json"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
