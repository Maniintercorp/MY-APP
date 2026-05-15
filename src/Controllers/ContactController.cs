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
        public async Task<IActionResult> PostContact([FromBody] ContactDto contactDto)
        {
            try
            {
                var result = await _contactService.SaveContactAsync(contactDto);
                return CreatedAtAction(nameof(PostContact), new { result.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while saving contact.");
                return StatusCode(500, "An error occurred while saving the contact.");
            }
        }
    }
}