using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Encodings.Web;
using FluentAssertions;
using Loginandregistrationpages.Api.Commands.LoginRegistrationPage;
using Loginandregistrationpages.Api.DTOs.LoginRegistrationPage;
using Loginandregistrationpages.Api.Queries.LoginRegistrationPage;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Loginandregistrationpages.Tests.LoginRegistrationPage;

public sealed class LoginRegistrationPageControllerIntegrationTests
{
    [Fact]
    public async Task Register_returns_created_auth_response()
    {
        var responseDto = CreateAuthResponse();
        await using var factory = new AuthControllerFactory(mock =>
        {
            mock.Setup(x => x.Send(It.IsAny<CreateLoginRegistrationPageCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(AuthResult<AuthResponseDto>.Created(responseDto));
        });
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequestDto
        {
            FirstName = "Jane",
            LastName = "Doe",
            Email = "jane@example.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var body = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
        body.Should().NotBeNull();
        body!.AccessToken.Should().Be("jwt-token");
        body.User.Email.Should().Be("jane@example.com");
    }

    [Fact]
    public async Task Login_returns_unauthorized_error_when_credentials_are_invalid()
    {
        await using var factory = new AuthControllerFactory(mock =>
        {
            mock.Setup(x => x.Send(It.IsAny<LoginLoginRegistrationPageCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(AuthResult<AuthResponseDto>.Failure(
                    StatusCodes.Status401Unauthorized,
                    ApiErrorResponseDto.Unauthorized("Invalid email or password.")));
        });
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequestDto
        {
            Email = "jane@example.com",
            Password = "wrong"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var body = await response.Content.ReadFromJsonAsync<ApiErrorResponseDto>();
        body!.Error.Should().Be("unauthorized");
        body.Message.Should().Be("Invalid email or password.");
    }

    [Fact]
    public async Task Me_returns_current_user_for_valid_authenticated_claim()
    {
        var userId = Guid.NewGuid();
        var user = new UserDto
        {
            Id = userId.ToString(),
            FirstName = "Jane",
            LastName = "Doe",
            Email = "jane@example.com",
            CreatedAtUtc = DateTime.UtcNow.ToString("O")
        };
        await using var factory = new AuthControllerFactory(mock =>
        {
            mock.Setup(x => x.Send(It.Is<GetLoginRegistrationPageByIdQuery>(q => q.Id == userId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(AuthResult<UserDto>.Ok(user));
        });
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");
        client.DefaultRequestHeaders.Add(TestAuthHandler.UserIdHeader, userId.ToString());

        var response = await client.GetAsync("/api/auth/me");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<UserDto>();
        body!.Id.Should().Be(userId.ToString());
        body.Email.Should().Be("jane@example.com");
    }

    [Fact]
    public async Task Me_returns_unauthorized_without_valid_guid_claim_and_does_not_call_mediator()
    {
        await using var factory = new AuthControllerFactory(_ => { });
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");
        client.DefaultRequestHeaders.Add(TestAuthHandler.UserIdHeader, "not-a-guid");

        var response = await client.GetAsync("/api/auth/me");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        factory.MediatorMock.Verify(x => x.Send(It.IsAny<GetLoginRegistrationPageByIdQuery>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Logout_returns_success_response_for_authenticated_user()
    {
        var userId = Guid.NewGuid();
        await using var factory = new AuthControllerFactory(mock =>
        {
            mock.Setup(x => x.Send(It.Is<LogoutLoginRegistrationPageCommand>(c => c.UserId == userId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(AuthResult<LogoutResponseDto>.Ok(new LogoutResponseDto
                {
                    Success = true,
                    Message = "Logged out successfully. Remove the access token from the client."
                }));
        });
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");
        client.DefaultRequestHeaders.Add(TestAuthHandler.UserIdHeader, userId.ToString());

        var response = await client.PostAsync("/api/auth/logout", content: null);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<LogoutResponseDto>();
        body!.Success.Should().BeTrue();
        body.Message.Should().Contain("Logged out successfully");
    }

    private static AuthResponseDto CreateAuthResponse() => new()
    {
        AccessToken = "jwt-token",
        TokenType = "Bearer",
        ExpiresIn = 3600,
        User = new UserDto
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = "Jane",
            LastName = "Doe",
            Email = "jane@example.com",
            CreatedAtUtc = DateTime.UtcNow.ToString("O")
        }
    };

    private sealed class AuthControllerFactory : WebApplicationFactory<Program>
    {
        private readonly Action<Mock<IMediator>> _configureMediator;

        public AuthControllerFactory(Action<Mock<IMediator>> configureMediator)
        {
            _configureMediator = configureMediator;
        }

        public Mock<IMediator> MediatorMock { get; } = new(MockBehavior.Strict);

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll<IMediator>();
                _configureMediator(MediatorMock);
                services.AddSingleton(MediatorMock.Object);

                services.AddAuthentication(options =>
                    {
                        options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
                        options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
                    })
                    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.SchemeName, _ => { });
            });
        }
    }

    private sealed class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public const string SchemeName = "Test";
        public const string UserIdHeader = "X-Test-UserId";

        public TestAuthHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock) : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var userId = Context.Request.Headers.TryGetValue(UserIdHeader, out var values)
                ? values.ToString()
                : Guid.NewGuid().ToString();

            var identity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim("sub", userId)
            }, SchemeName);

            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, SchemeName);
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
