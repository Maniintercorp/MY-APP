using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.DTOs.LoginAndRegistrationPages;
using Loginandregistrationpages.Api.Commands.LoginAndRegistrationPages;
using Loginandregistrationpages.Api.Queries.LoginAndRegistrationPages;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Loginandregistrationpages.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class LoginAndRegistrationPagesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<LoginAndRegistrationPagesController> _logger;
        public LoginAndRegistrationPagesController(IMediator mediator, ILogger<LoginAndRegistrationPagesController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<GetAllLoginAndRegistrationPagesResponse>>> GetAll()
        {
            var result = await _mediator.Send(new GetAllLoginAndRegistrationPagessQuery());
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<GetLoginAndRegistrationPagesByIdResponse>>> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetLoginAndRegistrationPagesByIdQuery(id));
            if (!result.Success || result.Data == null)
                return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<CreateLoginAndRegistrationPagesResponse>>> Create([FromBody] CreateLoginAndRegistrationPagesRequest request)
        {
            var result = await _mediator.Send(new CreateLoginAndRegistrationPagesCommand(request));
            return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UpdateLoginAndRegistrationPagesResponse>>> Update(Guid id, [FromBody] UpdateLoginAndRegistrationPagesRequest request)
        {
            var cmd = new UpdateLoginAndRegistrationPagesCommand(id, request);
            var result = await _mediator.Send(cmd);
            if (!result.Success)
                return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> Delete(Guid id)
        {
            var result = await _mediator.Send(new DeleteLoginAndRegistrationPagesCommand(id));
            if (!result.Success)
                return NotFound(result);
            return Ok(result);
        }
    }
}
