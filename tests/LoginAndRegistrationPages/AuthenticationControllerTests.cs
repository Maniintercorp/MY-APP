using System.Net;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using YourNamespaceHere;

namespace YourNamespaceHere.Tests
{
    public class AuthenticationControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public AuthenticationControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Login_ShouldReturnOk_WhenCredentialsAreValid()
        {
            var client = _factory.CreateClient();
            var response = await client.PostAsJsonAsync("/api/auth/login", new { username = "testuser", password = "password" });

            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task Register_ShouldReturnOk_WhenUserIsCreated()
        {
            var client = _factory.CreateClient();
            var response = await client.PostAsJsonAsync("/api/auth/register", new { username = "newuser", email = "newuser@example.com", password = "password" });

            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }
}