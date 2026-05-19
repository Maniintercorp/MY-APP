using MediatR;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.DTOs.Auth;
using Inventorymanagementsystem.Services;

namespace Inventorymanagementsystem.Commands.Auth;

public record LoginCommand(LoginRequest Request) : IRequest<ApiResponse<LoginResponse>>;

public class LoginCommandHandler : IRequestHandler<LoginCommand, ApiResponse<LoginResponse>>
{
    private readonly IAuthService _authService;
    private readonly ICacheService _cache;

    public LoginCommandHandler(IAuthService authService, ICacheService cache)
    {
        _authService = authService;
        _cache = cache;
    }

    public async Task<ApiResponse<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var response = await _authService.LoginAsync(request.Request, cancellationToken);
        await _cache.RemoveAsync("users:all", cancellationToken);
        return response;
    }
}
