using System.Threading.Tasks;
using MyProject.DTOs;

namespace MyProject.Services
{
    public interface IContactService
    {
        Task<bool> SubmitContactAsync(ContactDto contactDto);
    }
}
