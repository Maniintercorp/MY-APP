using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using MyApp;
using MyApp.DTOs;
using Newtonsoft.Json;

namespace MyApp.IntegrationTests
{
    public class UserControllerTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public UserControllerTests(WebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Login_ShouldReturnOk_WithValidCredentials()
        {
            // Arrange
            var userLogin = new UserLoginDTO { Email = "admin@example.com", Password = "adminpassword" };
            var content = new StringContent(JsonConvert.SerializeObject(userLogin), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/auth/login", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var responseData = await response.Content.ReadAsStringAsync();
            responseData.Should().Contain("token").And.Contain("userId");
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WithInvalidCredentials()
        {
            // Arrange
            var userLogin = new UserLoginDTO { Email = "wrong@example.com", Password = "wrongpassword" };
            var content = new StringContent(JsonConvert.SerializeObject(userLogin), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/auth/login", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task Login_ShouldReturnBadRequest_WhenModelIsInvalid()
        {
            // Arrange
            var userLogin = new { Email = "", Password = "" };
            var content = new StringContent(JsonConvert.SerializeObject(userLogin), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/auth/login", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
    }
}
