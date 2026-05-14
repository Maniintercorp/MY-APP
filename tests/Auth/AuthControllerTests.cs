using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using System.Text;
using Xunit;
using MY_APP;
using Newtonsoft.Json;
using FluentAssertions;
using System.Threading.Tasks;
using MY_APP.DTOs;

public class AuthControllerTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly HttpClient _client;

    public AuthControllerTests(WebApplicationFactory<Startup> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Optionally configure services here for testing
            });
        }).CreateClient();
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenCredentialsAreInvalid()
    {
        // Arrange
        var loginRequest = new LoginRequestDto {
            Username = "invalid_user",
            Password = "invalid_pass"
        };
        var content = new StringContent(JsonConvert.SerializeObject(loginRequest), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/auth/login", content);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_ShouldReturnOk_WhenCredentialsAreValid()
    {
        // This test would ideally require the in-memory database or a separate test database to validate.
        // Not implemented fully here due to complexity of writing data to database in setup.

        // Arrange
        var loginRequest = new LoginRequestDto {
            Username = "valid_user",
            Password = "correct_pass"
        };
        var content = new StringContent(JsonConvert.SerializeObject(loginRequest), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/auth/login", content);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        // Additional assertions might be needed to check the response content.
    }
}