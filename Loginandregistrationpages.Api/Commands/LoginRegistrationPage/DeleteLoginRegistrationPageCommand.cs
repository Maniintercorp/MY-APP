using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.Data;
using Loginandregistrationpages.Api.DTOs.LoginRegistrationPage;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Loginandregistrationpages.Api.Commands.LoginRegistrationPage;

public sealed record DeleteLoginRegistrationPageCommand(Guid Id) : IRequest<AuthResult<LogoutResponseDto>>;

public sealed class DeleteLoginRegistrationPageCommandHandler : IRequestHandler<DeleteLoginRegistrationPageCommand, AuthResult<LogoutResponseDto>>
{
    private readonly AppDbContext _db;
    private readonly ICacheService _cache;
    private readonly ILogger<DeleteLoginRegistrationPageCommandHandler> _logger;

    public DeleteLoginRegistrationPageCommandHandler(
        AppDbContext db,
        ICacheService cache,
        ILogger<DeleteLoginRegistrationPageCommandHandler> logger)
    {
        _db = db;
        _cache = cache;
        _logger = logger;
    }

    public async Task<AuthResult<LogoutResponseDto>> Handle(DeleteLoginRegistrationPageCommand command, CancellationToken cancellationToken)
    {
        var user = await _db.Users.FirstOrDefaultAsync(item => item.Id == command.Id && item.IsActive, cancellationToken);
        if (user is null)
        {
            return AuthResult<LogoutResponseDto>.Failure(
                StatusCodes.Status404NotFound,
                ApiErrorResponseDto.NotFound("User was not found."));
        }

        user.IsActive = false;
        user.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync("loginregistrationpage:all", cancellationToken);
        await _cache.RemoveAsync($"loginregistrationpage:{user.Id}", cancellationToken);

        _logger.LogInformation("Soft-deleted user {UserId}.", user.Id);

        return AuthResult<LogoutResponseDto>.Ok(new LogoutResponseDto
        {
            Success = true,
            Message = "User account was deactivated."
        });
    }
}

public sealed record LogoutLoginRegistrationPageCommand(Guid UserId) : IRequest<AuthResult<LogoutResponseDto>>;

public sealed class LogoutLoginRegistrationPageCommandHandler : IRequestHandler<LogoutLoginRegistrationPageCommand, AuthResult<LogoutResponseDto>>
{
    private readonly ILogger<LogoutLoginRegistrationPageCommandHandler> _logger;

    public LogoutLoginRegistrationPageCommandHandler(ILogger<LogoutLoginRegistrationPageCommandHandler> logger)
    {
        _logger = logger;
    }

    public Task<AuthResult<LogoutResponseDto>> Handle(LogoutLoginRegistrationPageCommand command, CancellationToken cancellationToken)
    {
        if (command.UserId != Guid.Empty)
        {
            _logger.LogInformation("User {UserId} logged out. JWT logout is handled client-side by removing the token.", command.UserId);
        }

        return Task.FromResult(AuthResult<LogoutResponseDto>.Ok(new LogoutResponseDto
        {
            Success = true,
            Message = "Logged out successfully. Remove the access token from the client."
        }));
    }
}
