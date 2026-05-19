using Microsoft.EntityFrameworkCore;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.Data;
using Inventorymanagementsystem.DTOs.Auth;
using Inventorymanagementsystem.Models;

namespace Inventorymanagementsystem.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(AppDbContext dbContext, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _dbContext = dbContext;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<ApiResponse<LoginResponse>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        if (await _dbContext.Users.AnyAsync(x => x.Email == normalizedEmail, cancellationToken))
        {
            return ApiResponse<LoginResponse>.Fail("Email is already registered.");
        }

        var user = new ApplicationUser
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User"
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Registered user {Email}", user.Email);
        return ApiResponse<LoginResponse>.Ok(BuildLoginResponse(user), "Registration successful.");
    }

    public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return ApiResponse<LoginResponse>.Fail("Invalid email or password.");
        }

        return ApiResponse<LoginResponse>.Ok(BuildLoginResponse(user), "Login successful.");
    }

    private LoginResponse BuildLoginResponse(ApplicationUser user)
    {
        var token = JwtHelper.GenerateToken(user, _configuration);
        return new LoginResponse
        {
            User = new AuthUserResponse { Id = user.Id, FullName = user.FullName, Email = user.Email },
            Token = token.Token,
            ExpiresAt = token.ExpiresAt
        };
    }
}
