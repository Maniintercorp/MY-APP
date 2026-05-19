using FluentValidation;
using Inventorymanagementsystem.Commands.Auth;

namespace Inventorymanagementsystem.Validators.Auth;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Request.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Request.Password).NotEmpty().MinimumLength(6).MaximumLength(100);
    }
}
