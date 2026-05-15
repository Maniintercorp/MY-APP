using Xunit;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using MyApp;

public class OrderControllerIntegrationTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly WebApplicationFactory<Startup> _factory;

    public OrderControllerIntegrationTests(WebApplicationFactory<Startup> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetOrders_ShouldReturnOkWithOrders()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/orders");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var responseData = await response.Content.ReadAsStringAsync();
        responseData.Should().Contain("orderNumber");
    }

    [Fact]
    public async Task GetOrderById_ShouldReturnNotFound_WhenOrderDoesNotExist()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync($"/api/orders/{Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}