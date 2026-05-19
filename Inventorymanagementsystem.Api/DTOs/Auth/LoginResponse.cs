namespace Inventorymanagementsystem.DTOs.Auth;

public class AuthUserResponse
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class LoginResponse
{
    public AuthUserResponse User { get; set; } = new();
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
