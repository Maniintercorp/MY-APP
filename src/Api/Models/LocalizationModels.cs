using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models;

[Table("SupportedLocales")]
public sealed class SupportedLocale
{
    [Key]
    [MaxLength(16)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string DisplayName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string NativeName { get; set; } = string.Empty;

    public bool IsDefault { get; set; }

    public bool IsEnabled { get; set; }

    [Required]
    [MaxLength(3)]
    public string Direction { get; set; } = "ltr";
}

[Table("TranslationResources")]
public sealed class TranslationResource
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(16)]
    public string LocaleCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(64)]
    public string Namespace { get; set; } = string.Empty;

    [Required]
    public string ResourcesJson { get; set; } = "{}";
}

[Table("UserLanguagePreferences")]
public sealed class UserLanguagePreference
{
    [Key]
    [MaxLength(450)]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [MaxLength(16)]
    public string PreferredLanguageCode { get; set; } = string.Empty;

    public DateTimeOffset UpdatedAt { get; set; }
}
