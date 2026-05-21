using System;
using Loginandregistrationpages.Api.Models;

namespace Loginandregistrationpages.Api.Models
{
    public class ApplicationUser : BaseEntity
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Role { get; set; } = "User";
    }
}
