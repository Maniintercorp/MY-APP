using FluentAssertions;
using Inventorymanagementsystem.Data;
using Inventorymanagementsystem.DTOs.Auth;
using Inventorymanagementsystem.Models;
using Inventorymanagementsystem.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;

namespace Inventorymanagementsystem.Tests.Auth;

public class AuthServiceTests
{
    private static AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var db = new AppDbContext(options);
        db.Database.EnsureCreated();
        return db;
    }

    private static IConfiguration CreateConfiguration() => new ConfigurationBuilder()
        .AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["JwtSettings:Key"] = "0123456789abcdef0123456789abcdef0123456789abcdef",
            ["JwtSettings:Issuer"] = "Inventorymanagementsystem",
            ["JwtSettings:Audience"] = "InventorymanagementsystemClient",
            ["JwtSettings:ExpiresMinutes"] = "120"
        })
        .Build();

    [Fact]
    public async Task RegisterAsync_ShouldCreateUserNormalizeEmailHashPasswordAndReturnToken()
    {
        await using var db = CreateDbContext();
        var service = new AuthService(db, CreateConfiguration(), Mock.Of<ILogger<AuthService>>());
        var request = new RegisterRequest
        {
            FullName = "  Jane Doe  ",
            Email = "  JANE@Example.COM ",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        var result = await service.RegisterAsync(request);

        result.Success.Should().BeTrue();
        result.Message.Should().Be("Registration successful.");
        result.Data.Should().NotBeNull();
        result.Data!.Token.Should().NotBeNullOrWhiteSpace();
        result.Data.User.Email.Should().Be("jane@example.com");

        var saved = await db.Users.SingleAsync(x => x.Email == "jane@example.com");
        saved.FullName.Should().Be("Jane Doe");
        saved.PasswordHash.Should().NotBe("Password123!");
        BCrypt.Net.BCrypt.Verify("Password123!", saved.PasswordHash).Should().BeTrue();
    }

    [Fact]
    public async Task RegisterAsync_ShouldFail_WhenEmailAlreadyExists()
    {
        await using var db = CreateDbContext();
        db.Users.Add(new ApplicationUser
        {
            FullName = "Existing",
            Email = "user@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!")
        });
        await db.SaveChangesAsync();
        var service = new AuthService(db, CreateConfiguration(), Mock.Of<ILogger<AuthService>>());

        var result = await service.RegisterAsync(new RegisterRequest
        {
            FullName = "Other",
            Email = " USER@example.com ",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Be("Email is already registered.");
        (await db.Users.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnToken_WhenCredentialsAreValid()
    {
        await using var db = CreateDbContext();
        db.Users.Add(new ApplicationUser
        {
            FullName = "Valid User",
            Email = "valid@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword"),
            Role = "Admin"
        });
        await db.SaveChangesAsync();
        var service = new AuthService(db, CreateConfiguration(), Mock.Of<ILogger<AuthService>>());

        var result = await service.LoginAsync(new LoginRequest { Email = " VALID@example.com ", Password = "CorrectPassword" });

        result.Success.Should().BeTrue();
        result.Message.Should().Be("Login successful.");
        result.Data!.Token.Should().NotBeNullOrWhiteSpace();
        result.Data.User.FullName.Should().Be("Valid User");
    }

    [Theory]
    [InlineData("missing@example.com", "CorrectPassword")]
    [InlineData("valid@example.com", "WrongPassword")]
    public async Task LoginAsync_ShouldFail_WhenCredentialsAreInvalid(string email, string password)
    {
        await using var db = CreateDbContext();
        db.Users.Add(new ApplicationUser
        {
            FullName = "Valid User",
            Email = "valid@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword")
        });
        await db.SaveChangesAsync();
        var service = new AuthService(db, CreateConfiguration(), Mock.Of<ILogger<AuthService>>());

        var result = await service.LoginAsync(new LoginRequest { Email = email, Password = password });

        result.Success.Should().BeFalse();
        result.Message.Should().Be("Invalid email or password.");
        result.Data.Should().BeNull();
    }
}
