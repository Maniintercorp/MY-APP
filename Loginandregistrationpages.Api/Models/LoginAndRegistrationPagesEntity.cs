using System;

namespace Loginandregistrationpages.Api.Models
{
    public class LoginAndRegistrationPagesEntity : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
