using System.Security.Claims;
using System.Text.Json.Serialization;
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Authorize]
[Route("api/users/me")]
public sealed class UserPreferencesController : ControllerBase
{
    private readonly AppDbContext _db;

    public UserPreferencesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("preferences")]
    [ProducesResponseType(typeof(UserLanguagePreferenceResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserLanguagePreferenceResponse>> GetPreferences(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var defaultLocale = await GetDefaultLocale(cancellationToken);
        var preference = await _db.UserLanguagePreferences
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.UserId == userId, cancellationToken);

        var preferredLanguageCode = preference?.PreferredLanguageCode ?? defaultLocale;
        var effectiveLanguageCode = await GetEffectiveLanguage(preferredLanguageCode, cancellationToken);
        var updatedAt = preference?.UpdatedAt ?? DateTimeOffset.UtcNow;

        return Ok(new UserLanguagePreferenceResponse(
            userId,
            preferredLanguageCode,
            effectiveLanguageCode,
            updatedAt.ToString("O"),
            null));
    }

    [HttpPut("language")]
    [ProducesResponseType(typeof(UserLanguagePreferenceResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserLanguagePreferenceResponse>> UpdateLanguage(
        [FromBody] UpdateLanguagePreferenceRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.LanguageCode))
        {
            return BadRequest(new { message = "languageCode is required." });
        }

        var supported = await _db.SupportedLocales
            .AsNoTracking()
            .AnyAsync(locale => locale.Code == request.LanguageCode && locale.IsEnabled, cancellationToken);

        if (!supported)
        {
            return BadRequest(new { message = "The requested language is not supported or enabled." });
        }

        var userId = GetUserId();
        var now = DateTimeOffset.UtcNow;
        var preference = await _db.UserLanguagePreferences
            .FirstOrDefaultAsync(item => item.UserId == userId, cancellationToken);

        if (preference is null)
        {
            preference = new UserLanguagePreference
            {
                UserId = userId,
                PreferredLanguageCode = request.LanguageCode,
                UpdatedAt = now
            };
            _db.UserLanguagePreferences.Add(preference);
        }
        else
        {
            preference.PreferredLanguageCode = request.LanguageCode;
            preference.UpdatedAt = now;
        }

        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new UserLanguagePreferenceResponse(
            userId,
            preference.PreferredLanguageCode,
            preference.PreferredLanguageCode,
            preference.UpdatedAt.ToString("O"),
            "Language preference updated."));
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new InvalidOperationException("Authenticated user id claim is missing.");
    }

    private async Task<string> GetDefaultLocale(CancellationToken cancellationToken)
    {
        return await _db.SupportedLocales
            .AsNoTracking()
            .Where(locale => locale.IsDefault && locale.IsEnabled)
            .Select(locale => locale.Code)
            .FirstOrDefaultAsync(cancellationToken) ?? "en";
    }

    private async Task<string> GetEffectiveLanguage(string preferredLanguageCode, CancellationToken cancellationToken)
    {
        var isEnabled = await _db.SupportedLocales
            .AsNoTracking()
            .AnyAsync(locale => locale.Code == preferredLanguageCode && locale.IsEnabled, cancellationToken);

        return isEnabled ? preferredLanguageCode : await GetDefaultLocale(cancellationToken);
    }
}

public sealed record UpdateLanguagePreferenceRequest(
    [property: JsonPropertyName("languageCode")] string LanguageCode);

public sealed record UserLanguagePreferenceResponse(
    [property: JsonPropertyName("userId")] string UserId,
    [property: JsonPropertyName("preferredLanguageCode")] string PreferredLanguageCode,
    [property: JsonPropertyName("effectiveLanguageCode")] string EffectiveLanguageCode,
    [property: JsonPropertyName("updatedAt")] string UpdatedAt,
    [property: JsonPropertyName("message")] string? Message);
