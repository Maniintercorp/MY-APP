using System.Threading.Tasks;
using MyProject.Models;
using MyProject.Data;
using Microsoft.EntityFrameworkCore;

namespace MyProject.Repositories
{
    public interface IContactRepository
    {
        Task<Contact> AddAsync(Contact contact);
    }

    public class ContactRepository : IContactRepository
    {
        private readonly ApplicationDbContext _context;

        public ContactRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Contact> AddAsync(Contact contact)
        {
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();
            return contact;
        }
    }
}