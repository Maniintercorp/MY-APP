using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using Xunit;
using FluentAssertions;
using WebApi;
using DTOs;

namespace Tests.LoginUserManagement
{
    public class AuthControllerTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public AuthControllerTests(WebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenInvalidCredentials()
        {
            var loginDto = new LoginDto { Username = "unknown", Password = "wrong" };
            var content = new StringContent(JsonConvert.SerializeObject(loginDto), Encoding.UTF8, "application/json");

            var response = await _client.PostAsync("/api/auth/login", content);

            response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task Register_ShouldReturnBadRequest_WhenUserAlreadyExists()
        {
            var registerDto = new RegisterDto { Username = "existuser", Password = "pass", Email = "exist@test.com" };
            var content = new StringContent(JsonConvert.SerializeObject(registerDto), Encoding.UTF8, "application/json");

            var response = await _client.PostAsync("/api/auth/register", content);

            response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Register_ShouldReturnCreated_WhenNewUserRegisters()
        {
            var registerDto = new RegisterDto { Username = "newuser", Password = "pass", Email = "new@test.com" };
            var content = new StringContent(JsonConvert.SerializeObject(registerDto), Encoding.UTF8, "application/json");

            var response = await _client.PostAsync("/api/auth/register", content);

            response.StatusCode.Should().Be(System.Net.HttpStatusCode.Created);
        }
    }
}
