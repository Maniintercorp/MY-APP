using System;
using System.Threading.Tasks;
using MY_APP.Models;
using Microsoft.EntityFrameworkCore;

namespace MY_APP.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByUsernameAsync(string username);
    }

    public class UserRepository : IUserRepository
    {
        private readonly MyAppDbContext _context;

        public UserRepository(MyAppDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
        }
    }
}
