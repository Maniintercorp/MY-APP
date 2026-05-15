using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Services;
using DTOs;
using Validators;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;
        private readonly IValidator<ContactDTO> _validator;
        private readonly ILogger<ContactController> _logger;

        public ContactController(IContactService contactService, IValidator<ContactDTO> validator, ILogger<ContactController> logger)
        {
            _contactService = contactService;
            _validator = validator;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitContactForm([FromBody] ContactDTO contactDTO)
        {
            var validationResult = await _validator.ValidateAsync(contactDTO);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for contact form submission.");
                return BadRequest(validationResult.Errors);
            }

            var result = await _contactService.SubmitContactFormAsync(contactDTO);

            if (result)
            {
                return Ok(new { success = true, message = "Form submitted successfully." });
            }

            _logger.LogError("Failed to submit contact form.");
            return StatusCode(500, new { success = false, message = "Internal server error." });
        }
    }
}
