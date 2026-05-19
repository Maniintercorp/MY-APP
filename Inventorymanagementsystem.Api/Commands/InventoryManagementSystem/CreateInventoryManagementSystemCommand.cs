using AutoMapper;
using MediatR;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.Data;
using Inventorymanagementsystem.DTOs.InventoryManagementSystem;
using Inventorymanagementsystem.Models;

namespace Inventorymanagementsystem.Commands.InventoryManagementSystem;

public record CreateInventoryManagementSystemCommand(CreateInventoryManagementSystemRequest Request) : IRequest<ApiResponse<InventoryManagementSystemResponse>>;

public class CreateInventoryManagementSystemCommandHandler : IRequestHandler<CreateInventoryManagementSystemCommand, ApiResponse<InventoryManagementSystemResponse>>
{
    private readonly AppDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ICacheService _cache;
    private readonly ILogger<CreateInventoryManagementSystemCommandHandler> _logger;

    public CreateInventoryManagementSystemCommandHandler(AppDbContext dbContext, IMapper mapper, ICacheService cache, ILogger<CreateInventoryManagementSystemCommandHandler> logger)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _cache = cache;
        _logger = logger;
    }

    public async Task<ApiResponse<InventoryManagementSystemResponse>> Handle(CreateInventoryManagementSystemCommand request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<InventoryManagementSystemEntity>(request.Request);
        _dbContext.InventoryManagementSystems.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync("inventorymanagementsystem:all", cancellationToken);
        _logger.LogInformation("Created InventoryManagementSystem entity {Id}", entity.Id);
        return ApiResponse<InventoryManagementSystemResponse>.Ok(_mapper.Map<InventoryManagementSystemResponse>(entity), "Created successfully.");
    }
}
