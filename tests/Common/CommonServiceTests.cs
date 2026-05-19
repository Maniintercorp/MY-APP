using FluentAssertions;
using FluentValidation;
using Inventorymanagementsystem.Common;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;

namespace Inventorymanagementsystem.Tests.Common;

public class CommonServiceTests
{
    [Fact]
    public async Task RedisCacheService_ShouldRoundTripAndRemoveTypedValues()
    {
        var services = new ServiceCollection();
        services.AddDistributedMemoryCache();
        var provider = services.BuildServiceProvider();
        var cache = new RedisCacheService(provider.GetRequiredService<IDistributedCache>());
        var value = new CacheDto("abc", 123);

        await cache.SetAsync("cache-key", value);
        var cached = await cache.GetAsync<CacheDto>("cache-key");
        await cache.RemoveAsync("cache-key");
        var removed = await cache.GetAsync<CacheDto>("cache-key");

        cached.Should().BeEquivalentTo(value);
        removed.Should().BeNull();
    }

    [Fact]
    public async Task ValidationBehaviour_ShouldCallNext_WhenNoValidatorsFail()
    {
        var validator = new PassingValidator();
        var behavior = new ValidationBehaviour<TestRequest, string>(new[] { validator });
        var called = false;

        var result = await behavior.Handle(new TestRequest("ok"), () =>
        {
            called = true;
            return Task.FromResult("next-result");
        }, CancellationToken.None);

        result.Should().Be("next-result");
        called.Should().BeTrue();
    }

    [Fact]
    public async Task ValidationBehaviour_ShouldThrowValidationException_WhenValidatorFails()
    {
        var behavior = new ValidationBehaviour<TestRequest, string>(new[] { new FailingValidator() });

        var action = async () => await behavior.Handle(new TestRequest(""), () => Task.FromResult("never"), CancellationToken.None);

        var exception = await action.Should().ThrowAsync<ValidationException>();
        exception.Which.Errors.Should().Contain(e => e.PropertyName == nameof(TestRequest.Name));
    }

    private sealed record CacheDto(string Name, int Count);
    private sealed record TestRequest(string Name);

    private sealed class PassingValidator : AbstractValidator<TestRequest>
    {
        public PassingValidator() => RuleFor(x => x.Name).NotEmpty();
    }

    private sealed class FailingValidator : AbstractValidator<TestRequest>
    {
        public FailingValidator() => RuleFor(x => x.Name).NotEmpty();
    }
}
