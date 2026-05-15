using System.Threading.Tasks;
using Models;
using Microsoft.EntityFrameworkCore;

namespace Repositories
{
    public class ContactRepository : IContactRepository
    {
        private readonly DbContext _context;

        public ContactRepository(DbContext context)
        {
            _context = context;
        }

        public async Task AddContactAsync(Contact contact)
        {
            _context.Set<Contact>().Add(contact);
            await _context.SaveChangesAsync();
        }
    }

    public interface IContactRepository
    {
        Task AddContactAsync(Contact contact);
    }
}
