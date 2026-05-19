using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.DTOs.Auth;

namespace Inventorymanagementsystem.Services;

public interface IAuthService
{
    Task<ApiResponse<LoginResponse>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
    Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
