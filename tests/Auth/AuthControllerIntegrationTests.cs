using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Loginandregistrationpages.Api;
using FluentAssertions;
using System.Net.Http.Json;
using Loginandregistrationpages.Api.DTOs.Auth;
using Loginandregistrationpages.Api.Common;
using System.Net;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Loginandregistrationpages.Api.Data;
using System;

namespace tests.Auth
{
    public class AuthControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public AuthControllerIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Override DB to InMemory
                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                    if (descriptor != null)
                        services.Remove(descriptor);
                    services.AddDbContext<AppDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("IntegrationDbAuth" + Guid.NewGuid());
                    });
                });
            });
        }

        [Fact]
        public async Task Register_And_Login_Flow_Works()
        {
            var client = _factory.CreateClient();
            var reg = new RegisterRequest
            {
                Username = "testuser",
                Email = "test@test.com",
                Password = "Password1A",
                ConfirmPassword = "Password1A"
            };
            var resp = await client.PostAsJsonAsync("/api/auth/register", reg);
            resp.StatusCode.Should().Be(HttpStatusCode.OK);
            var body = await resp.Content.ReadFromJsonAsync<ApiResponse<RegisterResponse>>();
            body!.Success.Should().BeTrue();
            body.Data.Username.Should().Be("testuser");
            // Now login
            var login = new LoginRequest { UsernameOrEmail = "testuser", Password = "Password1A" };
            var lresp = await client.PostAsJsonAsync("/api/auth/login", login);
            lresp.StatusCode.Should().Be(HttpStatusCode.OK);
            var lbody = await lresp.Content.ReadFromJsonAsync<ApiResponse<LoginResponse>>();
            lbody!.Success.Should().BeTrue();
            lbody.Data.Email.Should().Be("test@test.com");
            lbody.Data.Token.Should().NotBeNullOrWhiteSpace();
        }

        [Fact]
        public async Task Register_Fails_DuplicateUsername()
        {
            var client = _factory.CreateClient();
            var reg = new RegisterRequest { Username = "a", Email = "a@test.com", Password = "Password1A", ConfirmPassword = "Password1A" };
            await client.PostAsJsonAsync("/api/auth/register", reg);
            var reg2 = new RegisterRequest { Username = "a", Email = "b@test.com", Password = "Password1A", ConfirmPassword = "Password1A" };
            var resp = await client.PostAsJsonAsync("/api/auth/register", reg2);
            resp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            var body = await resp.Content.ReadFromJsonAsync<ApiResponse<RegisterResponse>>();
            body!.Success.Should().BeFalse();
            body.Message.Should().Contain("Username already exists");
        }

        [Fact]
        public async Task Login_Fails_InvalidPassword()
        {
            var client = _factory.CreateClient();
            var reg = new RegisterRequest { Username = "bob", Email = "bob@x.com", Password = "Password1A", ConfirmPassword = "Password1A" };
            await client.PostAsJsonAsync("/api/auth/register", reg);
            var login = new LoginRequest { UsernameOrEmail = "bob", Password = "wrong1" };
            var resp = await client.PostAsJsonAsync("/api/auth/login", login);
            resp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
            var body = await resp.Content.ReadFromJsonAsync<ApiResponse<LoginResponse>>();
            body!.Success.Should().BeFalse();
            body.Message.Should().Contain("Invalid credentials");
        }
    }
}
