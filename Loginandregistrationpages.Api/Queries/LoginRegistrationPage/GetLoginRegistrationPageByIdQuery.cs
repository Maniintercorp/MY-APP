using AutoMapper;
using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.Data;
using Loginandregistrationpages.Api.DTOs.LoginRegistrationPage;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Loginandregistrationpages.Api.Queries.LoginRegistrationPage;

public sealed record GetLoginRegistrationPageByIdQuery(Guid Id) : IRequest<AuthResult<UserDto>>;

public sealed class GetLoginRegistrationPageByIdQueryHandler : IRequestHandler<GetLoginRegistrationPageByIdQuery, AuthResult<UserDto>>
{
    private readonly AppDbContext _db;
    private readonly ICacheService _cache;
    private readonly IMapper _mapper;
    private readonly ILogger<GetLoginRegistrationPageByIdQueryHandler> _logger;

    public GetLoginRegistrationPageByIdQueryHandler(
        AppDbContext db,
        ICacheService cache,
        IMapper mapper,
        ILogger<GetLoginRegistrationPageByIdQueryHandler> logger)
    {
        _db = db;
        _cache = cache;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<AuthResult<UserDto>> Handle(GetLoginRegistrationPageByIdQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"loginregistrationpage:{request.Id}";
        var cached = await _cache.GetAsync<UserDto>(cacheKey, cancellationToken);
        if (cached is not null)
        {
            return AuthResult<UserDto>.Ok(cached);
        }

        var user = await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == request.Id && item.IsActive, cancellationToken);

        if (user is null)
        {
            return AuthResult<UserDto>.Failure(
                StatusCodes.Status404NotFound,
                ApiErrorResponseDto.NotFound("User was not found."));
        }

        var dto = _mapper.Map<UserDto>(user);
        await _cache.SetAsync(cacheKey, dto, TimeSpan.FromMinutes(5), cancellationToken);
        _logger.LogDebug("Cached user profile with key {CacheKey}.", cacheKey);

        return AuthResult<UserDto>.Ok(dto);
    }
}
