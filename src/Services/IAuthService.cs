using MyApp.DTOs;
using System.Threading.Tasks;

namespace MyApp.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> AuthenticateUserAsync(LoginRequestDto loginDto);
    }
}