using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.Data;
using Inventorymanagementsystem.DTOs.InventoryManagementSystem;

namespace Inventorymanagementsystem.Commands.InventoryManagementSystem;

public record UpdateInventoryManagementSystemCommand(int Id, UpdateInventoryManagementSystemRequest Request) : IRequest<ApiResponse<InventoryManagementSystemResponse>>;

public class UpdateInventoryManagementSystemCommandHandler : IRequestHandler<UpdateInventoryManagementSystemCommand, ApiResponse<InventoryManagementSystemResponse>>
{
    private readonly AppDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ICacheService _cache;
    private readonly ILogger<UpdateInventoryManagementSystemCommandHandler> _logger;

    public UpdateInventoryManagementSystemCommandHandler(AppDbContext dbContext, IMapper mapper, ICacheService cache, ILogger<UpdateInventoryManagementSystemCommandHandler> logger)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _cache = cache;
        _logger = logger;
    }

    public async Task<ApiResponse<InventoryManagementSystemResponse>> Handle(UpdateInventoryManagementSystemCommand request, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.InventoryManagementSystems.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity is null)
        {
            return ApiResponse<InventoryManagementSystemResponse>.Fail("InventoryManagementSystem entity not found.");
        }

        _mapper.Map(request.Request, entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync("inventorymanagementsystem:all", cancellationToken);
        await _cache.RemoveAsync($"inventorymanagementsystem:{entity.Id}", cancellationToken);
        _logger.LogInformation("Updated InventoryManagementSystem entity {Id}", entity.Id);
        return ApiResponse<InventoryManagementSystemResponse>.Ok(_mapper.Map<InventoryManagementSystemResponse>(entity), "Updated successfully.");
    }
}
