using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.DTOs.Auth;
using System.Threading.Tasks;

namespace Loginandregistrationpages.Api.Services
{
    public interface IAuthService
    {
        Task<ApiResponse<RegisterResponse>> RegisterAsync(RegisterRequest request);
        Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);
    }
}
