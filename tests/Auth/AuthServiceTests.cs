using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Loginandregistrationpages.Api.Services;
using Loginandregistrationpages.Api.Data;
using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.DTOs.Auth;
using Loginandregistrationpages.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;

namespace tests.Auth
{
    public class AuthServiceTests
    {
        private readonly Mock<IConfiguration> _configMock;
        private readonly Mock<ILogger<AuthService>> _loggerMock;
        private readonly DbContextOptions<AppDbContext> _dbOpts;

        public AuthServiceTests()
        {
            _configMock = new Mock<IConfiguration>();
            _configMock.Setup(x => x.GetSection("JwtSettings")["SecretKey"]).Returns("test-secret-key-12345678901234567890");
            _configMock.Setup(x => x.GetSection("JwtSettings") ["Issuer"]).Returns("TestIssuer");
            _configMock.Setup(x => x.GetSection("JwtSettings") ["Audience"]).Returns("TestAudience");
            _configMock.Setup(x => x.GetSection("JwtSettings") ["TokenLifetimeMinutes"]).Returns("60");
            _loggerMock = new Mock<ILogger<AuthService>>();
            _dbOpts = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        }

        [Fact]
        public async Task RegisterAsync_Fails_IfUsernameExists()
        {
            var db = new AppDbContext(_dbOpts);
            db.Users.Add(new ApplicationUser { Username = "bob", Email = "bob@test.com", PasswordHash = "x" });
            await db.SaveChangesAsync();
            var service = new AuthService(db, _configMock.Object, _loggerMock.Object);
            var req = new RegisterRequest { Username = "bob", Email = "bob2@test.com", Password = "Abcd1234", ConfirmPassword = "Abcd1234" };
            var result = await service.RegisterAsync(req);
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("Username already exists");
        }

        [Fact]
        public async Task RegisterAsync_Fails_IfEmailExists()
        {
            var db = new AppDbContext(_dbOpts);
            db.Users.Add(new ApplicationUser { Username = "carl", Email = "carl@test.com", PasswordHash = "y" });
            await db.SaveChangesAsync();
            var service = new AuthService(db, _configMock.Object, _loggerMock.Object);
            var req = new RegisterRequest { Username = "carl2", Email = "carl@test.com", Password = "Abcd1234", ConfirmPassword = "Abcd1234" };
            var result = await service.RegisterAsync(req);
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("Email already in use");
        }

        [Theory]
        [InlineData("foo", "Abcd1234", "Abcd1234", false)]
        [InlineData("foo", "abcd1234", "abcd1234", false)]
        [InlineData("foo", "Abcd", "Abcd", false)]
        [InlineData("foo", "", "", false)]
        [InlineData("foo", "Abcd1234", "mismatch", false)]
        [InlineData("foo", "Abcd1234", "Abcd1234", true)]
        public async Task RegisterAsync_Validates_PasswordAndConfirmation(string username, string password, string confirm, bool shouldSucceed)
        {
            var db = new AppDbContext(_dbOpts);
            var service = new AuthService(db, _configMock.Object, _loggerMock.Object);
            var req = new RegisterRequest { Username = username, Email = username + "@e.com", Password = password, ConfirmPassword = confirm };
            var result = await service.RegisterAsync(req);
            result.Success.Should().Be(shouldSucceed);
            if (!shouldSucceed)
                result.Message.Should().NotBeNullOrWhiteSpace();
            else
                result.Data.Should().NotBeNull();
        }

        [Fact]
        public async Task RegisterAsync_Success_CreatesUser()
        {
            var db = new AppDbContext(_dbOpts);
            var service = new AuthService(db, _configMock.Object, _loggerMock.Object);
            var req = new RegisterRequest { Username = "foo", Email = "f@t.com", Password = "Abcd1234", ConfirmPassword = "Abcd1234" };
            var result = await service.RegisterAsync(req);
            result.Success.Should().BeTrue();
            result.Data.Should().NotBeNull();
            db.Users.FirstOrDefaultAsync(u => u.Username == "foo").Result.Should().NotBeNull();
        }

        [Fact]
        public async Task LoginAsync_Fails_InvalidCredentials()
        {
            var db = new AppDbContext(_dbOpts);
            var service = new AuthService(db, _configMock.Object, _loggerMock.Object);
            var req = new LoginRequest { UsernameOrEmail = "missing", Password = "1234" };
            var result = await service.LoginAsync(req);
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("Invalid credentials");
        }

        [Fact]
        public async Task LoginAsync_Success_ReturnsTokenData()
        {
            var db = new AppDbContext(_dbOpts);
            var service = new AuthService(db, _configMock.Object, _loggerMock.Object);
            // First: register
            var reg = await service.RegisterAsync(new RegisterRequest { Username = "bar", Email = "bar@b.com", Password = "Qwerty123", ConfirmPassword = "Qwerty123" });
            var req = new LoginRequest { UsernameOrEmail = "bar", Password = "Qwerty123" };
            var result = await service.LoginAsync(req);
            result.Success.Should().BeTrue();
            result.Data!.Token.Should().NotBeNullOrWhiteSpace();
            result.Data.UserId.Should().NotBeNullOrWhiteSpace();
        }
    }
}
