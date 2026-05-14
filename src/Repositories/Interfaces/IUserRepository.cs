using System.Threading.Tasks;
using MY_APP.Models;

namespace MY_APP.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetUserByEmailAsync(string email);
    }
}
