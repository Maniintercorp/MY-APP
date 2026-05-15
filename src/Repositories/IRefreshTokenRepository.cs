using System.Threading.Tasks;
using Models;

namespace Repositories
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken> GetByTokenAsync(string token);
        Task CreateRefreshTokenAsync(RefreshToken refreshToken);
        Task UpdateRefreshTokenAsync(RefreshToken refreshToken);
    }
}
