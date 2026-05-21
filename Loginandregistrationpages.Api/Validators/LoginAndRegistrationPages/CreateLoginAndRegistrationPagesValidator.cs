using FluentValidation;
using Loginandregistrationpages.Api.DTOs.LoginAndRegistrationPages;

namespace Loginandregistrationpages.Api.Validators.LoginAndRegistrationPages
{
    public class CreateLoginAndRegistrationPagesValidator : AbstractValidator<CreateLoginAndRegistrationPagesRequest>
    {
        public CreateLoginAndRegistrationPagesValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Description).MaximumLength(400);
        }
    }
}
