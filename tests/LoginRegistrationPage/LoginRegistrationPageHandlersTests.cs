using AutoMapper;
using FluentAssertions;
using Loginandregistrationpages.Api.Commands.LoginRegistrationPage;
using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.Data;
using Loginandregistrationpages.Api.DTOs.LoginRegistrationPage;
using Loginandregistrationpages.Api.Mappings;
using Loginandregistrationpages.Api.Models;
using Loginandregistrationpages.Api.Queries.LoginRegistrationPage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Loginandregistrationpages.Tests.LoginRegistrationPage;

public sealed class LoginRegistrationPageHandlersTests
{
    private static AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static IConfiguration CreateConfiguration() => new ConfigurationBuilder()
        .AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["JwtSettings:SecretKey"] = "super-secret-test-signing-key-with-32-plus-chars",
            ["JwtSettings:Issuer"] = "tests",
            ["JwtSettings:Audience"] = "tests",
            ["JwtSettings:ExpiresInMinutes"] = "30"
        })
        .Build();

    private static IMapper CreateMapper() => new MapperConfiguration(cfg => cfg.AddProfile<LoginRegistrationPageMappingProfile>()).CreateMapper();

    private static User CreateUser(string email = "jane@example.com", string password = "Password123!")
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Jane",
            LastName = "Doe",
            Email = email,
            NormalizedEmail = email.Trim().ToUpperInvariant(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow.AddDays(-1)
        };
        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, password);
        return user;
    }

    [Fact]
    public async Task Register_creates_user_normalizes_email_invalidates_cache_and_returns_created_auth_response()
    {
        await using var db = CreateDbContext();
        var cache = new Mock<ICacheService>();
        var handler = new CreateLoginRegistrationPageCommandHandler(
            db,
            CreateConfiguration(),
            cache.Object,
            CreateMapper(),
            Mock.Of<ILogger<CreateLoginRegistrationPageCommandHandler>>());

        var result = await handler.Handle(new CreateLoginRegistrationPageCommand(new RegisterRequestDto
        {
            FirstName = " Jane ",
            LastName = " Doe ",
            Email = " Jane@Example.com ",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        }), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.StatusCode.Should().Be(StatusCodes.Status201Created);
        result.Data.Should().NotBeNull();
        result.Data!.AccessToken.Should().NotBeNullOrWhiteSpace();
        result.Data.TokenType.Should().Be("Bearer");
        result.Data.ExpiresIn.Should().Be(1800);
        result.Data.User.FirstName.Should().Be("Jane");
        result.Data.User.LastName.Should().Be("Doe");

        var stored = await db.Users.SingleAsync();
        stored.Email.Should().Be("Jane@Example.com");
        stored.NormalizedEmail.Should().Be("JANE@EXAMPLE.COM");
        stored.PasswordHash.Should().NotBe("Password123!");

        cache.Verify(x => x.RemoveAsync("loginregistrationpage:all", It.IsAny<CancellationToken>()), Times.Once);
        cache.Verify(x => x.RemoveAsync($"loginregistrationpage:{stored.Id}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Register_returns_conflict_when_email_already_exists()
    {
        await using var db = CreateDbContext();
        db.Users.Add(CreateUser("jane@example.com"));
        await db.SaveChangesAsync();
        var handler = new CreateLoginRegistrationPageCommandHandler(
            db,
            CreateConfiguration(),
            Mock.Of<ICacheService>(),
            CreateMapper(),
            Mock.Of<ILogger<CreateLoginRegistrationPageCommandHandler>>());

        var result = await handler.Handle(new CreateLoginRegistrationPageCommand(new RegisterRequestDto
        {
            FirstName = "Janet",
            LastName = "Doe",
            Email = " JANE@example.com ",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        }), CancellationToken.None);

        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(StatusCodes.Status409Conflict);
        result.Error!.Error.Should().Be("conflict");
        db.Users.Count().Should().Be(1);
    }

    [Fact]
    public async Task Login_with_valid_credentials_updates_login_timestamp_invalidates_cache_and_returns_auth_response()
    {
        await using var db = CreateDbContext();
        var existing = CreateUser(password: "Password123!");
        db.Users.Add(existing);
        await db.SaveChangesAsync();
        var cache = new Mock<ICacheService>();
        var handler = new LoginLoginRegistrationPageCommandHandler(
            db,
            CreateConfiguration(),
            cache.Object,
            CreateMapper(),
            Mock.Of<ILogger<LoginLoginRegistrationPageCommandHandler>>());

        var result = await handler.Handle(new LoginLoginRegistrationPageCommand(new LoginRequestDto
        {
            Email = " JANE@example.com ",
            Password = "Password123!"
        }), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
        result.Data!.AccessToken.Should().NotBeNullOrWhiteSpace();
        existing.LastLoginAtUtc.Should().NotBeNull();
        existing.UpdatedAtUtc.Should().NotBeNull();
        cache.Verify(x => x.RemoveAsync($"loginregistrationpage:{existing.Id}", It.IsAny<CancellationToken>()), Times.Once);
        cache.Verify(x => x.RemoveAsync("loginregistrationpage:all", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Login_returns_unauthorized_for_unknown_email_or_bad_password()
    {
        await using var db = CreateDbContext();
        db.Users.Add(CreateUser(password: "Password123!"));
        await db.SaveChangesAsync();
        var handler = new LoginLoginRegistrationPageCommandHandler(
            db,
            CreateConfiguration(),
            Mock.Of<ICacheService>(),
            CreateMapper(),
            Mock.Of<ILogger<LoginLoginRegistrationPageCommandHandler>>());

        var badPassword = await handler.Handle(new LoginLoginRegistrationPageCommand(new LoginRequestDto
        {
            Email = "jane@example.com",
            Password = "wrong"
        }), CancellationToken.None);

        var unknownEmail = await handler.Handle(new LoginLoginRegistrationPageCommand(new LoginRequestDto
        {
            Email = "missing@example.com",
            Password = "Password123!"
        }), CancellationToken.None);

        badPassword.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);
        badPassword.Error!.Message.Should().Be("Invalid email or password.");
        unknownEmail.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);
    }

    [Fact]
    public async Task GetById_returns_cached_user_without_setting_cache_again()
    {
        var cache = new Mock<ICacheService>();
        var cached = new UserDto { Id = Guid.NewGuid().ToString(), FirstName = "Cached", LastName = "User", Email = "cached@example.com" };
        cache.Setup(x => x.GetAsync<UserDto>($"loginregistrationpage:{cached.Id}", It.IsAny<CancellationToken>())).ReturnsAsync(cached);
        await using var db = CreateDbContext();
        var handler = new GetLoginRegistrationPageByIdQueryHandler(db, cache.Object, CreateMapper(), Mock.Of<ILogger<GetLoginRegistrationPageByIdQueryHandler>>());

        var result = await handler.Handle(new GetLoginRegistrationPageByIdQuery(Guid.Parse(cached.Id)), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.Data.Should().BeSameAs(cached);
        cache.Verify(x => x.SetAsync(It.IsAny<string>(), It.IsAny<UserDto>(), It.IsAny<TimeSpan>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task GetById_returns_not_found_for_missing_user()
    {
        await using var db = CreateDbContext();
        var handler = new GetLoginRegistrationPageByIdQueryHandler(db, Mock.Of<ICacheService>(), CreateMapper(), Mock.Of<ILogger<GetLoginRegistrationPageByIdQueryHandler>>());

        var result = await handler.Handle(new GetLoginRegistrationPageByIdQuery(Guid.NewGuid()), CancellationToken.None);

        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(StatusCodes.Status404NotFound);
        result.Error!.Error.Should().Be("not_found");
    }

    [Fact]
    public async Task GetAll_returns_active_users_ordered_by_created_date_and_caches_result()
    {
        await using var db = CreateDbContext();
        var older = CreateUser("older@example.com");
        older.CreatedAtUtc = DateTime.UtcNow.AddDays(-2);
        var newer = CreateUser("newer@example.com");
        newer.CreatedAtUtc = DateTime.UtcNow;
        var inactive = CreateUser("inactive@example.com");
        inactive.IsActive = false;
        db.Users.AddRange(older, newer, inactive);
        await db.SaveChangesAsync();
        var cache = new Mock<ICacheService>();
        cache.Setup(x => x.GetAsync<IReadOnlyList<UserDto>>("loginregistrationpage:all", It.IsAny<CancellationToken>())).ReturnsAsync((IReadOnlyList<UserDto>?)null);
        var handler = new GetAllLoginRegistrationPagesQueryHandler(db, cache.Object, CreateMapper(), Mock.Of<ILogger<GetAllLoginRegistrationPagesQueryHandler>>());

        var result = await handler.Handle(new GetAllLoginRegistrationPagesQuery(), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.Data.Should().HaveCount(2);
        result.Data!.Select(x => x.Email).Should().Equal("newer@example.com", "older@example.com");
        cache.Verify(x => x.SetAsync("loginregistrationpage:all", It.IsAny<IReadOnlyList<UserDto>>(), It.IsAny<TimeSpan>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Update_updates_names_trims_values_and_invalidates_cache()
    {
        await using var db = CreateDbContext();
        var existing = CreateUser();
        db.Users.Add(existing);
        await db.SaveChangesAsync();
        var cache = new Mock<ICacheService>();
        var handler = new UpdateLoginRegistrationPageCommandHandler(db, cache.Object, CreateMapper(), Mock.Of<ILogger<UpdateLoginRegistrationPageCommandHandler>>());

        var result = await handler.Handle(new UpdateLoginRegistrationPageCommand(existing.Id, new UpdateLoginRegistrationPageRequestDto
        {
            FirstName = " Janet ",
            LastName = " Smith "
        }), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.Data!.FirstName.Should().Be("Janet");
        result.Data.LastName.Should().Be("Smith");
        existing.FirstName.Should().Be("Janet");
        existing.LastName.Should().Be("Smith");
        cache.Verify(x => x.RemoveAsync("loginregistrationpage:all", It.IsAny<CancellationToken>()), Times.Once);
        cache.Verify(x => x.RemoveAsync($"loginregistrationpage:{existing.Id}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Delete_soft_deactivates_user_and_invalidates_cache()
    {
        await using var db = CreateDbContext();
        var existing = CreateUser();
        db.Users.Add(existing);
        await db.SaveChangesAsync();
        var cache = new Mock<ICacheService>();
        var handler = new DeleteLoginRegistrationPageCommandHandler(db, cache.Object, Mock.Of<ILogger<DeleteLoginRegistrationPageCommandHandler>>());

        var result = await handler.Handle(new DeleteLoginRegistrationPageCommand(existing.Id), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.Data!.Success.Should().BeTrue();
        existing.IsActive.Should().BeFalse();
        existing.UpdatedAtUtc.Should().NotBeNull();
        cache.Verify(x => x.RemoveAsync("loginregistrationpage:all", It.IsAny<CancellationToken>()), Times.Once);
        cache.Verify(x => x.RemoveAsync($"loginregistrationpage:{existing.Id}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Logout_returns_successful_client_side_logout_message()
    {
        var handler = new LogoutLoginRegistrationPageCommandHandler(Mock.Of<ILogger<LogoutLoginRegistrationPageCommandHandler>>());

        var result = await handler.Handle(new LogoutLoginRegistrationPageCommand(Guid.NewGuid()), CancellationToken.None);

        result.Success.Should().BeTrue();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
        result.Data!.Success.Should().BeTrue();
        result.Data.Message.Should().Contain("Remove the access token");
    }
}
