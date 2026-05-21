using System;

namespace Loginandregistrationpages.Api.DTOs.LoginAndRegistrationPages
{
    public class UpdateLoginAndRegistrationPagesResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime? UpdatedAt { get; set; }
    }
}
