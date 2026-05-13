using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using YourApp.DTOs;
using YourApp.Repositories;
using AutoMapper;

namespace YourApp.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, IMapper mapper, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ProfileUpdateResponseDto> UpdateProfileAsync(ProfileUpdateRequestDto profileUpdateRequestDto)
        {
            var user = await _userRepository.GetUserByIdAsync(profileUpdateRequestDto.UserId);
            if (user == null)
            {
                _logger.LogError("User not found for profile update: {UserId}", profileUpdateRequestDto.UserId);
                return null;
            }

            _mapper.Map(profileUpdateRequestDto, user);
            var result = await _userRepository.UpdateUserAsync(user);
            if (!result)
            {
                _logger.LogError("Profile update failed for user {UserId}", profileUpdateRequestDto.UserId);
                return null;
            }

            return _mapper.Map<ProfileUpdateResponseDto>(user);
        }
    }
}