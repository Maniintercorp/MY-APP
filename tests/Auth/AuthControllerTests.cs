using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using FluentAssertions;
using MY_APP.DTOs;
using Xunit;

namespace MY_APP.Tests
{
    public class AuthControllerTests : IClassFixture<WebApplicationFactory<MY_APP.Startup>>
    {
        private readonly WebApplicationFactory<MY_APP.Startup> _factory;

        public AuthControllerTests(WebApplicationFactory<MY_APP.Startup> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Login_ShouldReturnOk_WhenCredentialsAreValid()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.PostAsJsonAsync("/api/auth/login", new UserLoginDTO
            {
                Username = "validUser",
                Password = "validPass"
            });

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var result = await response.Content.ReadFromJsonAsync<dynamic>();
            result.token.Should().NotBeNull();
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenCredentialsAreInvalid()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.PostAsJsonAsync("/api/auth/login", new UserLoginDTO
            {
                Username = "invalidUser",
                Password = "invalidPass"
            });

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
            var result = await response.Content.ReadFromJsonAsync<dynamic>();
            result.error.Should().Be("Invalid username or password.");
        }
    }
}