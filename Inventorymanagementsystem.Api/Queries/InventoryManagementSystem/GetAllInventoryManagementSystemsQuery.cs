using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.Data;
using Inventorymanagementsystem.DTOs.InventoryManagementSystem;

namespace Inventorymanagementsystem.Queries.InventoryManagementSystem;

public record GetAllInventoryManagementSystemsQuery(string? Search, int Page = 1, int PageSize = 20) : IRequest<ApiResponse<PagedResult<InventoryManagementSystemResponse>>>;

public class GetAllInventoryManagementSystemsQueryHandler : IRequestHandler<GetAllInventoryManagementSystemsQuery, ApiResponse<PagedResult<InventoryManagementSystemResponse>>>
{
    private readonly AppDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ICacheService _cache;

    public GetAllInventoryManagementSystemsQueryHandler(AppDbContext dbContext, IMapper mapper, ICacheService cache)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _cache = cache;
    }

    public async Task<ApiResponse<PagedResult<InventoryManagementSystemResponse>>> Handle(GetAllInventoryManagementSystemsQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page <= 0 ? 1 : request.Page;
        var pageSize = request.PageSize <= 0 ? 20 : Math.Min(request.PageSize, 100);
        var key = string.IsNullOrWhiteSpace(request.Search)
            ? "inventorymanagementsystem:all"
            : $"inventorymanagementsystem:all:{request.Search.Trim().ToLowerInvariant()}:{page}:{pageSize}";

        var cached = await _cache.GetAsync<PagedResult<InventoryManagementSystemResponse>>(key, cancellationToken);
        if (cached is not null)
        {
            return ApiResponse<PagedResult<InventoryManagementSystemResponse>>.Ok(cached);
        }

        var query = _dbContext.InventoryManagementSystems.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            query = query.Where(x => x.Name.Contains(search) || (x.Description != null && x.Description.Contains(search)));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ProjectTo<InventoryManagementSystemResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        var result = new PagedResult<InventoryManagementSystemResponse>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };

        await _cache.SetAsync(key, result, new DistributedCacheEntryOptions { SlidingExpiration = TimeSpan.FromMinutes(5) }, cancellationToken);
        return ApiResponse<PagedResult<InventoryManagementSystemResponse>>.Ok(result);
    }
}
