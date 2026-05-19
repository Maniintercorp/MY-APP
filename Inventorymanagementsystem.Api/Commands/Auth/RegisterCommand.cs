using MediatR;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.DTOs.Auth;
using Inventorymanagementsystem.Services;

namespace Inventorymanagementsystem.Commands.Auth;

public record RegisterCommand(RegisterRequest Request) : IRequest<ApiResponse<LoginResponse>>;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, ApiResponse<LoginResponse>>
{
    private readonly IAuthService _authService;
    private readonly ICacheService _cache;

    public RegisterCommandHandler(IAuthService authService, ICacheService cache)
    {
        _authService = authService;
        _cache = cache;
    }

    public async Task<ApiResponse<LoginResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var response = await _authService.RegisterAsync(request.Request, cancellationToken);
        await _cache.RemoveAsync("users:all", cancellationToken);
        return response;
    }
}
