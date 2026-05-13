using System.Threading.Tasks;
using YourApp.DTOs;

namespace YourApp.Services
{
    public interface IUserService
    {
        Task<ProfileUpdateResponseDto> UpdateProfileAsync(ProfileUpdateRequestDto profileUpdateRequestDto);
    }
}