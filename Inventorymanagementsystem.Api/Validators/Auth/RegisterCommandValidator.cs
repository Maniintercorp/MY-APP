using FluentValidation;
using Inventorymanagementsystem.Commands.Auth;

namespace Inventorymanagementsystem.Validators.Auth;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Request.FullName).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Request.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Request.Password).NotEmpty().MinimumLength(8).MaximumLength(100);
        RuleFor(x => x.Request.ConfirmPassword).Equal(x => x.Request.Password).WithMessage("Passwords do not match.");
    }
}
