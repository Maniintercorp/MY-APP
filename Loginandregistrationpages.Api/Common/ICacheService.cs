using System;
using System.Threading;
using System.Threading.Tasks;
namespace Loginandregistrationpages.Api.Common
{
    public interface ICacheService
    {
        Task<T?> GetAsync<T>(string key, CancellationToken ct = default);
        Task SetAsync<T>(string key, T value, TimeSpan? slidingExpiration = null, CancellationToken ct = default);
        Task RemoveAsync(string key, CancellationToken ct = default);
    }
}
