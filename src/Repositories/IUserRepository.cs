using System;
using System.Threading.Tasks;
using YourApp.Models;

namespace YourApp.Repositories
{
    public interface IUserRepository
    {
        Task<bool> AddUserAsync(User user);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(Guid userId);
        Task<bool> UpdateUserAsync(User user);
    }
}