using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using MyProject;
using MyProject.DTOs;

namespace MyProject.Tests
{
    public class UserControllerIntegrationTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public UserControllerIntegrationTests(WebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Register_ShouldReturnCreatedResponse()
        {
            var request = new UserRegistrationRequest
            {
                Username = "newuser",
                Email = "newuser@example.com",
                Password = "password123"
            };

            var response = await _client.PostAsJsonAsync("/api/user/register", request);

            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var content = await response.Content.ReadFromJsonAsync<UserRegistrationResponse>();
            content.Message.Should().Be("User registered successfully");
        }

        [Fact]
        public async Task Login_ShouldReturnOkResponseOnValidCredentials()
        {
            var request = new UserLoginRequest
            {
                Email = "existing@example.com",
                Password = "validpassword"
            };

            var response = await _client.PostAsJsonAsync("/api/user/login", request);

            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task UpdateProfile_ShouldReturnNotFoundOnInvalidUserId()
        {
            var request = new UserProfileUpdateRequest
            {
                UserId = Guid.NewGuid(),
                Username = "updateduser",
                Email = "updated@example.com"
            };

            var response = await _client.PutAsJsonAsync("/api/user/profile", request);

            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
