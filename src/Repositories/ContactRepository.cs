using System.Threading.Tasks;
using MyProject.Models;
using MyProject.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MyProject.Repositories
{
    public class ContactRepository : IContactRepository
    {
        private readonly ContactDbContext _context;

        public ContactRepository(ContactDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddContactAsync(ContactDto contactDto)
        {
            var contact = new Contact
            {
                Name = contactDto.Name,
                Email = contactDto.Email,
                Message = contactDto.Message,
                CreatedAt = DateTime.Now
            };

            _context.Contacts.Add(contact);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
