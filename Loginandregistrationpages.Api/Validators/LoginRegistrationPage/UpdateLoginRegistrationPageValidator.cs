using FluentValidation;
using Loginandregistrationpages.Api.Commands.LoginRegistrationPage;

namespace Loginandregistrationpages.Api.Validators.LoginRegistrationPage;

public sealed class UpdateLoginRegistrationPageValidator : AbstractValidator<UpdateLoginRegistrationPageCommand>
{
    public UpdateLoginRegistrationPageValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty().WithMessage("User id is required.");

        RuleFor(command => command.Request.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(100).WithMessage("First name must be 100 characters or fewer.");

        RuleFor(command => command.Request.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(100).WithMessage("Last name must be 100 characters or fewer.");
    }
}
