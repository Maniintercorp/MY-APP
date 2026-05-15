using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MyProject.Services;
using MyProject.DTOs;
using Microsoft.Extensions.Logging;

namespace MyProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;
        private readonly ILogger<ContactController> _logger;

        public ContactController(IContactService contactService, ILogger<ContactController> logger)
        {
            _contactService = contactService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitContact([FromBody] ContactDto contactDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid contact form submission.");
                return BadRequest(new { success = false, message = "Invalid data." });
            }

            var result = await _contactService.SubmitContactAsync(contactDto);

            if (result)
            {
                return Ok(new { success = true, message = "Contact form submitted successfully." });
            }

            _logger.LogError("Failed to submit contact form.");
            return StatusCode(500, new { success = false, message = "An error occurred while submitting the contact form." });
        }
    }
}
