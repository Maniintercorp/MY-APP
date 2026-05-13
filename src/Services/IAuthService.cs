using System;
using System.Threading.Tasks;
using YourApp.DTOs;

namespace YourApp.Services
{
    public interface IAuthService
    {
        Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto registerRequestDto);
        Task<string> LoginAsync(LoginRequestDto loginRequestDto);
        Guid? ValidateToken(string token);
        Task<User> GetUserByIdAsync(Guid userId);
    }
}