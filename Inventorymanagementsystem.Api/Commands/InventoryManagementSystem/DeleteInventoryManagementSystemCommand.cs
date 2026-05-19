using MediatR;
using Microsoft.EntityFrameworkCore;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.Data;

namespace Inventorymanagementsystem.Commands.InventoryManagementSystem;

public record DeleteInventoryManagementSystemCommand(int Id) : IRequest<ApiResponse<bool>>;

public class DeleteInventoryManagementSystemCommandHandler : IRequestHandler<DeleteInventoryManagementSystemCommand, ApiResponse<bool>>
{
    private readonly AppDbContext _dbContext;
    private readonly ICacheService _cache;
    private readonly ILogger<DeleteInventoryManagementSystemCommandHandler> _logger;

    public DeleteInventoryManagementSystemCommandHandler(AppDbContext dbContext, ICacheService cache, ILogger<DeleteInventoryManagementSystemCommandHandler> logger)
    {
        _dbContext = dbContext;
        _cache = cache;
        _logger = logger;
    }

    public async Task<ApiResponse<bool>> Handle(DeleteInventoryManagementSystemCommand request, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.InventoryManagementSystems.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity is null)
        {
            return ApiResponse<bool>.Fail("InventoryManagementSystem entity not found.");
        }

        entity.IsDeleted = true;
        await _dbContext.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync("inventorymanagementsystem:all", cancellationToken);
        await _cache.RemoveAsync($"inventorymanagementsystem:{entity.Id}", cancellationToken);
        _logger.LogInformation("Soft deleted InventoryManagementSystem entity {Id}", entity.Id);
        return ApiResponse<bool>.Ok(true, "Deleted successfully.");
    }
}
