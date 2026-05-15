using Moq;
using Xunit;
using FluentAssertions;
using MyApp.Services;
using MyApp.Repositories;
using MyApp.Models;
using System;
using System.Threading.Tasks;

public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _orderRepoMock;
    private readonly OrderService _orderService;

    public OrderServiceTests()
    {
        _orderRepoMock = new Mock<IOrderRepository>();
        _orderService = new OrderService(_orderRepoMock.Object);
    }

    [Fact]
    public async Task GetOrderById_ShouldReturnOrder_WhenOrderExists()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        var expectedOrder = new Order { Id = orderId, OrderNumber = "ORD123" };
        _orderRepoMock.Setup(repo => repo.GetOrderByIdAsync(orderId)).ReturnsAsync(expectedOrder);

        // Act
        var actual = await _orderService.GetOrderByIdAsync(orderId);

        // Assert
        actual.Should().BeEquivalentTo(expectedOrder);
    }

    [Fact]
    public async Task GetOrderById_ShouldReturnNull_WhenOrderDoesNotExist()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        _orderRepoMock.Setup(repo => repo.GetOrderByIdAsync(orderId)).ReturnsAsync((Order)null);

        // Act
        var actual = await _orderService.GetOrderByIdAsync(orderId);

        // Assert
        actual.Should().BeNull();
    }
}