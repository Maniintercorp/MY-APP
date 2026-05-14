using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MY_APP.Models;
using MY_APP.Repositories.Interfaces;

namespace MY_APP.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DbContext _context;

        public UserRepository(DbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
