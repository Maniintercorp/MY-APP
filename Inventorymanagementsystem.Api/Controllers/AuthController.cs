using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Inventorymanagementsystem.Commands.Auth;
using Inventorymanagementsystem.DTOs.Auth;

namespace Inventorymanagementsystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
[EnableRateLimiting("fixed")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IMediator mediator, ILogger<AuthController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new RegisterCommand(request), cancellationToken);
        if (!response.Success || response.Data is null)
        {
            return BadRequest(new { message = response.Message, errors = response.Errors });
        }

        _logger.LogInformation("User registered through API: {Email}", request.Email);
        return StatusCode(StatusCodes.Status201Created, response.Data);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new LoginCommand(request), cancellationToken);
        if (!response.Success || response.Data is null)
        {
            return Unauthorized(new { message = response.Message, errors = response.Errors });
        }

        return Ok(response.Data);
    }
}
