using System.Threading.Tasks;
using MyProject.DTOs;

namespace MyProject.Repositories
{
    public interface IContactRepository
    {
        Task<bool> AddContactAsync(ContactDto contactDto);
    }
}
