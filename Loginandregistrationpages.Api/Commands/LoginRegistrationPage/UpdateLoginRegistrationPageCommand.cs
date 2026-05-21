using AutoMapper;
using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.Data;
using Loginandregistrationpages.Api.DTOs.LoginRegistrationPage;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Loginandregistrationpages.Api.Commands.LoginRegistrationPage;

public sealed record UpdateLoginRegistrationPageCommand(Guid Id, UpdateLoginRegistrationPageRequestDto Request) : IRequest<AuthResult<UserDto>>;

public sealed class UpdateLoginRegistrationPageCommandHandler : IRequestHandler<UpdateLoginRegistrationPageCommand, AuthResult<UserDto>>
{
    private readonly AppDbContext _db;
    private readonly ICacheService _cache;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdateLoginRegistrationPageCommandHandler> _logger;

    public UpdateLoginRegistrationPageCommandHandler(
        AppDbContext db,
        ICacheService cache,
        IMapper mapper,
        ILogger<UpdateLoginRegistrationPageCommandHandler> logger)
    {
        _db = db;
        _cache = cache;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<AuthResult<UserDto>> Handle(UpdateLoginRegistrationPageCommand command, CancellationToken cancellationToken)
    {
        var user = await _db.Users.FirstOrDefaultAsync(item => item.Id == command.Id && item.IsActive, cancellationToken);
        if (user is null)
        {
            return AuthResult<UserDto>.Failure(
                StatusCodes.Status404NotFound,
                ApiErrorResponseDto.NotFound("User was not found."));
        }

        user.FirstName = command.Request.FirstName.Trim();
        user.LastName = command.Request.LastName.Trim();
        user.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync("loginregistrationpage:all", cancellationToken);
        await _cache.RemoveAsync($"loginregistrationpage:{user.Id}", cancellationToken);

        _logger.LogInformation("Updated user profile {UserId}.", user.Id);
        return AuthResult<UserDto>.Ok(_mapper.Map<UserDto>(user));
    }
}
