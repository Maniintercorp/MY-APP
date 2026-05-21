using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/i18n")]
public sealed class I18nController : ControllerBase
{
    private readonly AppDbContext _db;

    public I18nController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("locales")]
    [ProducesResponseType(typeof(SupportedLocalesResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<SupportedLocalesResponse>> GetLocales(CancellationToken cancellationToken)
    {
        var locales = await _db.SupportedLocales
            .AsNoTracking()
            .Where(locale => locale.IsEnabled)
            .OrderByDescending(locale => locale.IsDefault)
            .ThenBy(locale => locale.DisplayName)
            .Select(locale => new SupportedLocaleDto(
                locale.Code,
                locale.DisplayName,
                locale.NativeName,
                locale.IsDefault,
                locale.IsEnabled,
                locale.Direction))
            .ToListAsync(cancellationToken);

        var defaultLocale = locales.FirstOrDefault(locale => locale.IsDefault)?.Code
            ?? locales.FirstOrDefault()?.Code
            ?? "en";

        return Ok(new SupportedLocalesResponse(locales, defaultLocale));
    }

    [HttpGet("translations/{locale}")]
    [ProducesResponseType(typeof(TranslationResourcesResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<TranslationResourcesResponse>> GetTranslations(
        [FromRoute] string locale,
        [FromQuery] string? namespace,
        CancellationToken cancellationToken)
    {
        var defaultLocale = await _db.SupportedLocales
            .AsNoTracking()
            .Where(item => item.IsDefault && item.IsEnabled)
            .Select(item => item.Code)
            .FirstOrDefaultAsync(cancellationToken) ?? "en";

        var requestedLocale = await _db.SupportedLocales
            .AsNoTracking()
            .Where(item => item.Code == locale && item.IsEnabled)
            .Select(item => item.Code)
            .FirstOrDefaultAsync(cancellationToken) ?? defaultLocale;

        var query = _db.TranslationResources.AsNoTracking()
            .Where(resource => resource.LocaleCode == defaultLocale || resource.LocaleCode == requestedLocale);

        if (!string.IsNullOrWhiteSpace(namespace))
        {
            query = query.Where(resource => resource.Namespace == namespace);
        }

        var resources = await query.ToListAsync(cancellationToken);

        var namespaces = new Dictionary<string, Dictionary<string, object?>>(StringComparer.OrdinalIgnoreCase);

        foreach (var resource in resources.Where(resource => resource.LocaleCode == defaultLocale))
        {
            namespaces[resource.Namespace] = DeserializeDictionary(resource.ResourcesJson);
        }

        foreach (var resource in resources.Where(resource => resource.LocaleCode == requestedLocale))
        {
            var current = namespaces.TryGetValue(resource.Namespace, out var existing)
                ? existing
                : new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);

            namespaces[resource.Namespace] = Merge(current, DeserializeDictionary(resource.ResourcesJson));
        }

        return Ok(new TranslationResourcesResponse(requestedLocale, defaultLocale, namespaces));
    }

    private static Dictionary<string, object?> DeserializeDictionary(string json)
    {
        return JsonSerializer.Deserialize<Dictionary<string, object?>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }) ?? new Dictionary<string, object?>();
    }

    private static Dictionary<string, object?> Merge(Dictionary<string, object?> fallback, Dictionary<string, object?> requested)
    {
        var merged = new Dictionary<string, object?>(fallback, StringComparer.OrdinalIgnoreCase);

        foreach (var pair in requested)
        {
            merged[pair.Key] = pair.Value;
        }

        return merged;
    }
}

public sealed record SupportedLocaleDto(
    [property: JsonPropertyName("code")] string Code,
    [property: JsonPropertyName("displayName")] string DisplayName,
    [property: JsonPropertyName("nativeName")] string NativeName,
    [property: JsonPropertyName("isDefault")] bool IsDefault,
    [property: JsonPropertyName("isEnabled")] bool IsEnabled,
    [property: JsonPropertyName("direction")] string Direction);

public sealed record SupportedLocalesResponse(
    [property: JsonPropertyName("locales")] IReadOnlyList<SupportedLocaleDto> Locales,
    [property: JsonPropertyName("defaultLocale")] string DefaultLocale);

public sealed record TranslationResourcesResponse(
    [property: JsonPropertyName("locale")] string Locale,
    [property: JsonPropertyName("fallbackLocale")] string FallbackLocale,
    [property: JsonPropertyName("namespaces")] IReadOnlyDictionary<string, Dictionary<string, object?>> Namespaces);
