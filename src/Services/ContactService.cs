using Repositories;
using DTOs;
using Models;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Services
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<ContactService> _logger;

        public ContactService(IContactRepository repository, IMapper mapper, ILogger<ContactService> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<bool> SubmitContactFormAsync(ContactDTO contactDTO)
        {
            try
            {
                var contact = _mapper.Map<Contact>(contactDTO);
                contact.CreatedAt = DateTime.UtcNow;

                await _repository.AddContactAsync(contact);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while submitting contact form.");
                return false;
            }
        }
    }

    public interface IContactService
    {
        Task<bool> SubmitContactFormAsync(ContactDTO contactDTO);
    }
}
