using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.Data;
using Loginandregistrationpages.Api.DTOs.LoginRegistrationPage;
using Loginandregistrationpages.Api.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Loginandregistrationpages.Api.Commands.LoginRegistrationPage;

public sealed record CreateLoginRegistrationPageCommand(RegisterRequestDto Request) : IRequest<AuthResult<AuthResponseDto>>;

public sealed class CreateLoginRegistrationPageCommandHandler : IRequestHandler<CreateLoginRegistrationPageCommand, AuthResult<AuthResponseDto>>
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;
    private readonly ICacheService _cache;
    private readonly IMapper _mapper;
    private readonly ILogger<CreateLoginRegistrationPageCommandHandler> _logger;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public CreateLoginRegistrationPageCommandHandler(
        AppDbContext db,
        IConfiguration configuration,
        ICacheService cache,
        IMapper mapper,
        ILogger<CreateLoginRegistrationPageCommandHandler> logger)
    {
        _db = db;
        _configuration = configuration;
        _cache = cache;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<AuthResult<AuthResponseDto>> Handle(CreateLoginRegistrationPageCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;
        var normalizedEmail = NormalizeEmail(request.Email);

        var emailExists = await _db.Users
            .AsNoTracking()
            .AnyAsync(user => user.NormalizedEmail == normalizedEmail, cancellationToken);

        if (emailExists)
        {
            return AuthResult<AuthResponseDto>.Failure(
                StatusCodes.Status409Conflict,
                ApiErrorResponseDto.Conflict("An account with this email address already exists."));
        }

        var now = DateTime.UtcNow;
        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim(),
            NormalizedEmail = normalizedEmail,
            IsActive = true,
            CreatedAtUtc = now
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        await _db.Users.AddAsync(user, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        await InvalidateUserCaches(user.Id, cancellationToken);

        _logger.LogInformation("Registered new user {UserId} with email {Email}.", user.Id, user.Email);

        var response = CreateAuthResponse(user, _configuration, _mapper);
        return AuthResult<AuthResponseDto>.Created(response);
    }

    private async Task InvalidateUserCaches(Guid userId, CancellationToken cancellationToken)
    {
        await _cache.RemoveAsync("loginregistrationpage:all", cancellationToken);
        await _cache.RemoveAsync($"loginregistrationpage:{userId}", cancellationToken);
    }

    private static string NormalizeEmail(string email) => email.Trim().ToUpperInvariant();

    internal static AuthResponseDto CreateAuthResponse(User user, IConfiguration configuration, IMapper mapper)
    {
        var expiresIn = GetExpiresInSeconds(configuration);
        var expiresAt = DateTime.UtcNow.AddSeconds(expiresIn);
        var token = GenerateJwt(user, configuration, expiresAt);

        return new AuthResponseDto
        {
            AccessToken = token,
            TokenType = "Bearer",
            ExpiresIn = expiresIn,
            User = mapper.Map<UserDto>(user)
        };
    }

    internal static long GetExpiresInSeconds(IConfiguration configuration)
    {
        var minutes = configuration.GetValue<int?>("JwtSettings:ExpiresInMinutes")
            ?? configuration.GetValue<int?>("JwtSettings:ExpirationMinutes")
            ?? configuration.GetValue<int?>("JwtSettings:TokenExpirationMinutes")
            ?? 60;

        return minutes * 60L;
    }

    internal static string GenerateJwt(User user, IConfiguration configuration, DateTime expiresAtUtc)
    {
        var secret = configuration["JwtSettings:SecretKey"]
            ?? configuration["JwtSettings:SigningKey"]
            ?? throw new InvalidOperationException("JWT signing key is not configured.");

        var issuer = configuration["JwtSettings:Issuer"];
        var audience = configuration["JwtSettings:Audience"];
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.GivenName, user.FirstName),
            new(ClaimTypes.Surname, user.LastName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAtUtc,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public sealed record LoginLoginRegistrationPageCommand(LoginRequestDto Request) : IRequest<AuthResult<AuthResponseDto>>;

public sealed class LoginLoginRegistrationPageCommandHandler : IRequestHandler<LoginLoginRegistrationPageCommand, AuthResult<AuthResponseDto>>
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;
    private readonly ICacheService _cache;
    private readonly IMapper _mapper;
    private readonly ILogger<LoginLoginRegistrationPageCommandHandler> _logger;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public LoginLoginRegistrationPageCommandHandler(
        AppDbContext db,
        IConfiguration configuration,
        ICacheService cache,
        IMapper mapper,
        ILogger<LoginLoginRegistrationPageCommandHandler> logger)
    {
        _db = db;
        _configuration = configuration;
        _cache = cache;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<AuthResult<AuthResponseDto>> Handle(LoginLoginRegistrationPageCommand command, CancellationToken cancellationToken)
    {
        var normalizedEmail = command.Request.Email.Trim().ToUpperInvariant();

        var user = await _db.Users
            .FirstOrDefaultAsync(item => item.NormalizedEmail == normalizedEmail && item.IsActive, cancellationToken);

        if (user is null)
        {
            return AuthResult<AuthResponseDto>.Failure(
                StatusCodes.Status401Unauthorized,
                ApiErrorResponseDto.Unauthorized("Invalid email or password."));
        }

        var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, command.Request.Password);
        if (verification == PasswordVerificationResult.Failed)
        {
            return AuthResult<AuthResponseDto>.Failure(
                StatusCodes.Status401Unauthorized,
                ApiErrorResponseDto.Unauthorized("Invalid email or password."));
        }

        if (verification == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, command.Request.Password);
        }

        user.LastLoginAtUtc = DateTime.UtcNow;
        user.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);

        await _cache.RemoveAsync($"loginregistrationpage:{user.Id}", cancellationToken);
        await _cache.RemoveAsync("loginregistrationpage:all", cancellationToken);

        _logger.LogInformation("User {UserId} logged in successfully.", user.Id);

        var response = CreateLoginRegistrationPageCommandHandler.CreateAuthResponse(user, _configuration, _mapper);
        return AuthResult<AuthResponseDto>.Ok(response);
    }
}
