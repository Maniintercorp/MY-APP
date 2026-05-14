using System;
using System.ComponentModel.DataAnnotations;

namespace MyApp.Models
{
    public class User
    {
        public Guid UserId { get; set; }

        [Required, MaxLength(255)]
        public string Email { get; set; }

        [Required]
        public byte[] PasswordHash { get; set; }
    }
}