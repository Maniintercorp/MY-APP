using System.Threading.Tasks;
using MY_APP.DTOs;

namespace MY_APP.Services.Interfaces
{
    public interface IUserService
    {
        Task<LoginResponseDto> AuthenticateAsync(LoginRequestDto loginRequest);
    }
}
