using Microsoft.EntityFrameworkCore;
using MY_APP.Models;
using System.Threading.Tasks;

namespace MY_APP.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByUsernameAsync(string username);
    }

    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(x => x.Username == username);
        }
    }
}
