using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.Data;
using Inventorymanagementsystem.DTOs.InventoryManagementSystem;

namespace Inventorymanagementsystem.Queries.InventoryManagementSystem;

public record GetInventoryManagementSystemByIdQuery(int Id) : IRequest<ApiResponse<InventoryManagementSystemResponse>>;

public class GetInventoryManagementSystemByIdQueryHandler : IRequestHandler<GetInventoryManagementSystemByIdQuery, ApiResponse<InventoryManagementSystemResponse>>
{
    private readonly AppDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ICacheService _cache;

    public GetInventoryManagementSystemByIdQueryHandler(AppDbContext dbContext, IMapper mapper, ICacheService cache)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _cache = cache;
    }

    public async Task<ApiResponse<InventoryManagementSystemResponse>> Handle(GetInventoryManagementSystemByIdQuery request, CancellationToken cancellationToken)
    {
        var key = $"inventorymanagementsystem:{request.Id}";
        var cached = await _cache.GetAsync<InventoryManagementSystemResponse>(key, cancellationToken);
        if (cached is not null)
        {
            return ApiResponse<InventoryManagementSystemResponse>.Ok(cached);
        }

        var entity = await _dbContext.InventoryManagementSystems.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity is null)
        {
            return ApiResponse<InventoryManagementSystemResponse>.Fail("InventoryManagementSystem entity not found.");
        }

        var response = _mapper.Map<InventoryManagementSystemResponse>(entity);
        await _cache.SetAsync(key, response, new DistributedCacheEntryOptions { SlidingExpiration = TimeSpan.FromMinutes(5) }, cancellationToken);
        return ApiResponse<InventoryManagementSystemResponse>.Ok(response);
    }
}
