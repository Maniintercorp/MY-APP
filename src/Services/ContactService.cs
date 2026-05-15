using System;
using System.Threading.Tasks;
using MyProject.DTOs;
using MyProject.Repositories;
using Microsoft.Extensions.Logging;

namespace MyProject.Services
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;
        private readonly ILogger<ContactService> _logger;

        public ContactService(IContactRepository contactRepository, ILogger<ContactService> logger)
        {
            _contactRepository = contactRepository;
            _logger = logger;
        }

        public async Task<bool> SubmitContactAsync(ContactDto contactDto)
        {
            try
            {
                return await _contactRepository.AddContactAsync(contactDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in submitting contact data.");
                return false;
            }
        }
    }
}
