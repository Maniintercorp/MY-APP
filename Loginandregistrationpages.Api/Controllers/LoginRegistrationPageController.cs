using System.Security.Claims;
using Loginandregistrationpages.Api.Commands.LoginRegistrationPage;
using Loginandregistrationpages.Api.DTOs.LoginRegistrationPage;
using Loginandregistrationpages.Api.Queries.LoginRegistrationPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Loginandregistrationpages.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class LoginRegistrationPageController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<LoginRegistrationPageController> _logger;

    public LoginRegistrationPageController(IMediator mediator, ILogger<LoginRegistrationPageController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [EnableRateLimiting("fixed")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiErrorResponseDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponseDto), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CreateLoginRegistrationPageCommand(request), cancellationToken);
        return ToActionResult(result, createdActionName: nameof(Me));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("fixed")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponseDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponseDto), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new LoginLoginRegistrationPageCommand(request), cancellationToken);
        return ToActionResult(result);
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponseDto), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiErrorResponseDto), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (!Guid.TryParse(userIdValue, out var userId))
        {
            _logger.LogWarning("Authenticated request to /api/auth/me did not include a valid user id claim.");
            return Unauthorized(ApiErrorResponseDto.Unauthorized("A valid bearer token is required."));
        }

        var result = await _mediator.Send(new GetLoginRegistrationPageByIdQuery(userId), cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(LogoutResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponseDto), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        Guid.TryParse(userIdValue, out var userId);

        var result = await _mediator.Send(new LogoutLoginRegistrationPageCommand(userId), cancellationToken);
        return ToActionResult(result);
    }

    private IActionResult ToActionResult<T>(AuthResult<T> result, string? createdActionName = null)
    {
        if (result.Success && result.Data is not null)
        {
            if (result.StatusCode == StatusCodes.Status201Created && createdActionName is not null)
            {
                return CreatedAtAction(createdActionName, result.Data);
            }

            return StatusCode(result.StatusCode, result.Data);
        }

        var error = result.Error ?? ApiErrorResponseDto.BadRequest("The request could not be processed.");
        return StatusCode(result.StatusCode, error);
    }
}
