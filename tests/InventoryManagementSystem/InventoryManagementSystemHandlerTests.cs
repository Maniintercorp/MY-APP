using AutoMapper;
using FluentAssertions;
using Inventorymanagementsystem.Commands.InventoryManagementSystem;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.Data;
using Inventorymanagementsystem.DTOs.InventoryManagementSystem;
using Inventorymanagementsystem.Mappings;
using Inventorymanagementsystem.Models;
using Inventorymanagementsystem.Queries.InventoryManagementSystem;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace Inventorymanagementsystem.Tests.InventoryManagementSystem;

public class InventoryManagementSystemHandlerTests
{
    private static AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var db = new AppDbContext(options);
        db.Database.EnsureCreated();
        return db;
    }

    private static IMapper CreateMapper() => new MapperConfiguration(cfg => cfg.AddProfile<InventoryManagementSystemMappingProfile>()).CreateMapper();

    [Fact]
    public async Task CreateHandler_ShouldPersistEntityAndInvalidateListCache()
    {
        await using var db = CreateDbContext();
        var cache = new Mock<ICacheService>();
        var handler = new CreateInventoryManagementSystemCommandHandler(
            db,
            CreateMapper(),
            cache.Object,
            Mock.Of<ILogger<CreateInventoryManagementSystemCommandHandler>>());

        var result = await handler.Handle(new CreateInventoryManagementSystemCommand(new CreateInventoryManagementSystemRequest
        {
            Name = "Warehouse",
            Description = "Main warehouse",
            Status = "Active"
        }), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.Data!.Id.Should().BeGreaterThan(0);
        result.Data.Name.Should().Be("Warehouse");
        (await db.InventoryManagementSystems.CountAsync()).Should().Be(1);
        cache.Verify(x => x.RemoveAsync("inventorymanagementsystem:all", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateHandler_ShouldReturnFailure_WhenEntityDoesNotExist()
    {
        await using var db = CreateDbContext();
        var handler = new UpdateInventoryManagementSystemCommandHandler(
            db,
            CreateMapper(),
            Mock.Of<ICacheService>(),
            Mock.Of<ILogger<UpdateInventoryManagementSystemCommandHandler>>());

        var result = await handler.Handle(new UpdateInventoryManagementSystemCommand(999, new UpdateInventoryManagementSystemRequest { Name = "Missing" }), CancellationToken.None);

        result.Success.Should().BeFalse();
        result.Message.Should().Be("InventoryManagementSystem entity not found.");
    }

    [Fact]
    public async Task UpdateHandler_ShouldModifyEntityAndClearEntityAndListCache()
    {
        await using var db = CreateDbContext();
        db.InventoryManagementSystems.Add(new InventoryManagementSystemEntity { Name = "Old", Description = "Old desc", Status = "Draft" });
        await db.SaveChangesAsync();
        var entityId = await db.InventoryManagementSystems.Select(x => x.Id).SingleAsync();
        var cache = new Mock<ICacheService>();
        var handler = new UpdateInventoryManagementSystemCommandHandler(
            db,
            CreateMapper(),
            cache.Object,
            Mock.Of<ILogger<UpdateInventoryManagementSystemCommandHandler>>());

        var result = await handler.Handle(new UpdateInventoryManagementSystemCommand(entityId, new UpdateInventoryManagementSystemRequest
        {
            Name = "Updated",
            Description = "Updated desc",
            Status = "Active"
        }), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.Data!.Name.Should().Be("Updated");
        result.Data.Status.Should().Be("Active");
        cache.Verify(x => x.RemoveAsync("inventorymanagementsystem:all", It.IsAny<CancellationToken>()), Times.Once);
        cache.Verify(x => x.RemoveAsync($"inventorymanagementsystem:{entityId}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteHandler_ShouldSoftDeleteEntityAndClearCaches()
    {
        await using var db = CreateDbContext();
        db.InventoryManagementSystems.Add(new InventoryManagementSystemEntity { Name = "Delete me", Status = "Active" });
        await db.SaveChangesAsync();
        var entityId = await db.InventoryManagementSystems.Select(x => x.Id).SingleAsync();
        var cache = new Mock<ICacheService>();
        var handler = new DeleteInventoryManagementSystemCommandHandler(
            db,
            cache.Object,
            Mock.Of<ILogger<DeleteInventoryManagementSystemCommandHandler>>());

        var result = await handler.Handle(new DeleteInventoryManagementSystemCommand(entityId), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.Data.Should().BeTrue();
        (await db.InventoryManagementSystems.IgnoreQueryFilters().SingleAsync(x => x.Id == entityId)).IsDeleted.Should().BeTrue();
        cache.Verify(x => x.RemoveAsync("inventorymanagementsystem:all", It.IsAny<CancellationToken>()), Times.Once);
        cache.Verify(x => x.RemoveAsync($"inventorymanagementsystem:{entityId}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetByIdQuery_ShouldReturnCachedValue_WhenCacheHit()
    {
        await using var db = CreateDbContext();
        var cached = new InventoryManagementSystemResponse { Id = 10, Name = "Cached", Status = "Active" };
        var cache = new Mock<ICacheService>();
        cache.Setup(x => x.GetAsync<InventoryManagementSystemResponse>("inventorymanagementsystem:10", It.IsAny<CancellationToken>())).ReturnsAsync(cached);
        var handler = new GetInventoryManagementSystemByIdQueryHandler(db, CreateMapper(), cache.Object);

        var result = await handler.Handle(new GetInventoryManagementSystemByIdQuery(10), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.Data.Should().BeEquivalentTo(cached);
        cache.Verify(x => x.SetAsync(It.IsAny<string>(), It.IsAny<InventoryManagementSystemResponse>(), It.IsAny<Microsoft.Extensions.Caching.Distributed.DistributedCacheEntryOptions>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task GetAllQuery_ShouldPageSearchAndCacheResults()
    {
        await using var db = CreateDbContext();
        db.InventoryManagementSystems.AddRange(
            new InventoryManagementSystemEntity { Name = "Alpha", Description = "First", Status = "Active", CreatedAt = DateTime.UtcNow.AddMinutes(-2) },
            new InventoryManagementSystemEntity { Name = "Beta", Description = "Contains target", Status = "Draft", CreatedAt = DateTime.UtcNow.AddMinutes(-1) },
            new InventoryManagementSystemEntity { Name = "Gamma", Description = "Other", Status = "Archived", CreatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();
        var cache = new Mock<ICacheService>();
        var handler = new GetAllInventoryManagementSystemsQueryHandler(db, CreateMapper(), cache.Object);

        var result = await handler.Handle(new GetAllInventoryManagementSystemsQuery("target", 1, 10), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.Data!.Items.Should().ContainSingle(x => x.Name == "Beta");
        result.Data.TotalCount.Should().Be(1);
        result.Data.Page.Should().Be(1);
        result.Data.PageSize.Should().Be(10);
        cache.Verify(x => x.SetAsync(It.Is<string>(key => key.Contains("target")), It.IsAny<PagedResult<InventoryManagementSystemResponse>>(), It.IsAny<Microsoft.Extensions.Caching.Distributed.DistributedCacheEntryOptions>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}
