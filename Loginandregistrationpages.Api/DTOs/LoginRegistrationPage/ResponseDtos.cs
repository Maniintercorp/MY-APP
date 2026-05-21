namespace Loginandregistrationpages.Api.DTOs.LoginRegistrationPage;

public sealed class AuthResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string TokenType { get; set; } = "Bearer";
    public long ExpiresIn { get; set; }
    public UserDto User { get; set; } = new();
}

public sealed class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CreatedAtUtc { get; set; } = string.Empty;
}

public sealed class LogoutResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

public sealed class ApiErrorResponseDto
{
    public string Error { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public IReadOnlyDictionary<string, string[]>? Errors { get; set; }

    public static ApiErrorResponseDto BadRequest(string message, IReadOnlyDictionary<string, string[]>? errors = null) => new()
    {
        Error = "bad_request",
        Message = message,
        Errors = errors
    };

    public static ApiErrorResponseDto Unauthorized(string message) => new()
    {
        Error = "unauthorized",
        Message = message
    };

    public static ApiErrorResponseDto NotFound(string message) => new()
    {
        Error = "not_found",
        Message = message
    };

    public static ApiErrorResponseDto Conflict(string message) => new()
    {
        Error = "conflict",
        Message = message
    };
}

public sealed class AuthResult<T>
{
    public bool Success { get; init; }
    public int StatusCode { get; init; }
    public T? Data { get; init; }
    public ApiErrorResponseDto? Error { get; init; }

    public static AuthResult<T> Ok(T data) => new()
    {
        Success = true,
        StatusCode = StatusCodes.Status200OK,
        Data = data
    };

    public static AuthResult<T> Created(T data) => new()
    {
        Success = true,
        StatusCode = StatusCodes.Status201Created,
        Data = data
    };

    public static AuthResult<T> Failure(int statusCode, ApiErrorResponseDto error) => new()
    {
        Success = false,
        StatusCode = statusCode,
        Error = error
    };
}
