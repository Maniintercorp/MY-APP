using AutoMapper;
using AutoMapper.QueryableExtensions;
using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.Data;
using Loginandregistrationpages.Api.DTOs.LoginRegistrationPage;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Loginandregistrationpages.Api.Queries.LoginRegistrationPage;

public sealed record GetAllLoginRegistrationPagesQuery : IRequest<AuthResult<IReadOnlyList<UserDto>>>;

public sealed class GetAllLoginRegistrationPagesQueryHandler : IRequestHandler<GetAllLoginRegistrationPagesQuery, AuthResult<IReadOnlyList<UserDto>>>
{
    private const string CacheKey = "loginregistrationpage:all";

    private readonly AppDbContext _db;
    private readonly ICacheService _cache;
    private readonly IMapper _mapper;
    private readonly ILogger<GetAllLoginRegistrationPagesQueryHandler> _logger;

    public GetAllLoginRegistrationPagesQueryHandler(
        AppDbContext db,
        ICacheService cache,
        IMapper mapper,
        ILogger<GetAllLoginRegistrationPagesQueryHandler> logger)
    {
        _db = db;
        _cache = cache;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<AuthResult<IReadOnlyList<UserDto>>> Handle(GetAllLoginRegistrationPagesQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<IReadOnlyList<UserDto>>(CacheKey, cancellationToken);
        if (cached is not null)
        {
            return AuthResult<IReadOnlyList<UserDto>>.Ok(cached);
        }

        var users = await _db.Users
            .AsNoTracking()
            .Where(user => user.IsActive)
            .OrderByDescending(user => user.CreatedAtUtc)
            .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        await _cache.SetAsync(CacheKey, users, TimeSpan.FromMinutes(5), cancellationToken);
        _logger.LogDebug("Cached active users list with key {CacheKey}.", CacheKey);

        return AuthResult<IReadOnlyList<UserDto>>.Ok(users);
    }
}
