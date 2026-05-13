// Ensure Username matches required non-nullable constraint
using System;

namespace YourApp.Models
{
    public class User
    {
        public Guid UserId { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Username { get; set; } // should be non-nullable to match frontend and API contract
        public DateTime CreatedAt { get; set; }
    }
}
