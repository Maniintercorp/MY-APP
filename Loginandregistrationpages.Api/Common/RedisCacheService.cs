using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Loginandregistrationpages.Api.Common
{
    public class RedisCacheService : ICacheService
    {
        private readonly IDistributedCache _cache;
        public RedisCacheService(IDistributedCache cache) => _cache = cache;

        public async Task<T?> GetAsync<T>(string key, CancellationToken ct = default)
        {
            var value = await _cache.GetStringAsync(key, ct);
            if (value == null) return default;
            return JsonSerializer.Deserialize<T>(value);
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? slidingExpiration = null, CancellationToken ct = default)
        {
            var options = new DistributedCacheEntryOptions { SlidingExpiration = slidingExpiration ?? TimeSpan.FromMinutes(5) };
            await _cache.SetStringAsync(key, JsonSerializer.Serialize(value), options, ct);
        }

        public async Task RemoveAsync(string key, CancellationToken ct = default)
        {
            await _cache.RemoveAsync(key, ct);
        }
    }
}
