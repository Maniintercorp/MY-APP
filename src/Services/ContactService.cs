using System;
using System.Threading.Tasks;
using MyProject.Repositories;
using MyProject.Models;
using MyProject.DTOs;
using AutoMapper;
using Microsoft.Extensions.Logging;

namespace MyProject.Services
{
    public interface IContactService
    {
        Task<ContactResponseDto> SaveContactAsync(ContactDto contactDto);
    }

    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<ContactService> _logger;

        public ContactService(IContactRepository contactRepository, IMapper mapper, ILogger<ContactService> logger)
        {
            _contactRepository = contactRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ContactResponseDto> SaveContactAsync(ContactDto contactDto)
        {
            var contact = _mapper.Map<Contact>(contactDto);
            contact.CreatedAt = DateTime.UtcNow;
            var savedContact = await _contactRepository.AddAsync(contact);
            return _mapper.Map<ContactResponseDto>(savedContact);
        }
    }
}