// Integration tests for Authentication Controller
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

public class AuthControllerTests : IClassFixture<WebApplicationFactory<Startup>>
{
  private readonly WebApplicationFactory<Startup> _factory;

  public AuthControllerTests(WebApplicationFactory<Startup> factory)
  {
    _factory = factory;
  }

  [Fact]
  public async Task UserRegister_ShouldReturnSuccessStatusCode()
  {
    var client = _factory.CreateClient();

    var response = await client.PostAsJsonAsync("/api/auth/register", new {
      Username = "newUser",
      Password = "password!1",
      Email = "user@example.com"
    });

    response.StatusCode.Should().Be(HttpStatusCode.OK);
  }

  [Fact]
  public async Task UserLogin_ShouldReturnSuccessAndToken()
  {
    var client = _factory.CreateClient();

    var response = await client.PostAsJsonAsync("/api/auth/login", new {
      Username = "existingUser",
      Password = "correctpassword"
    });

    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var content = await response.Content.ReadAsStringAsync();
    content.Should().Contain("token");
  }
}