using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using YourApp;
using Microsoft.AspNetCore.Mvc.Testing;
using FluentAssertions;

public class UserControllerIntegrationTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly HttpClient _client;
    
    public UserControllerIntegrationTests(WebApplicationFactory<Startup> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task RegisterUser_ShouldReturnSuccess_WhenDataIsValid()
    {
        // Arrange
        var content = new StringContent("{"username":"test","email":"test@example.com","password":"password123"}", System.Text.Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/register", content);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        var responseData = await response.Content.ReadAsStringAsync();
        responseData.Should().Contain("User registered");
    }

    [Fact]
    public async Task RegisterUser_ShouldReturnBadRequest_WhenDataIsInvalid()
    {
        // Arrange
        var content = new StringContent("{"username":"","email":"invalidemail","password":""}", System.Text.Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/register", content);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }
}