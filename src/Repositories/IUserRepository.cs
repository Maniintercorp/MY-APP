using System.Threading.Tasks;
using MyApp.Models;

namespace MyApp.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByEmailAsync(string email);
    }
}