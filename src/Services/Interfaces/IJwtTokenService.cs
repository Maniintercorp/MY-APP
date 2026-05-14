using MY_APP.Models;

namespace MY_APP.Services.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
        string GenerateRefreshToken();
    }
}
