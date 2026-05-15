using FluentValidation;
using DTOs;

namespace Validators
{
    public class LoginValidator : AbstractValidator<LoginDto>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Username).NotEmpty();
            RuleFor(x => x.Password).NotEmpty();
        }
    }
}
