using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

namespace Inventorymanagementsystem.Common;

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);

    public RedisCacheService(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        var value = await _cache.GetStringAsync(key, cancellationToken);
        return string.IsNullOrWhiteSpace(value) ? default : JsonSerializer.Deserialize<T>(value, Options);
    }

    public async Task SetAsync<T>(string key, T value, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default)
    {
        options ??= new DistributedCacheEntryOptions { SlidingExpiration = TimeSpan.FromMinutes(5) };
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(value, Options), options, cancellationToken);
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        await _cache.RemoveAsync(key, cancellationToken);
    }
}
