using FluentValidation;
using Loginandregistrationpages.Api.Commands.LoginRegistrationPage;

namespace Loginandregistrationpages.Api.Validators.LoginRegistrationPage;

public sealed class CreateLoginRegistrationPageValidator : AbstractValidator<CreateLoginRegistrationPageCommand>
{
    public CreateLoginRegistrationPageValidator()
    {
        RuleFor(command => command.Request.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(100).WithMessage("First name must be 100 characters or fewer.");

        RuleFor(command => command.Request.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(100).WithMessage("Last name must be 100 characters or fewer.");

        RuleFor(command => command.Request.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Enter a valid email address.")
            .MaximumLength(256).WithMessage("Email must be 256 characters or fewer.");

        RuleFor(command => command.Request.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
            .Matches("[A-Z]").WithMessage("Password must include at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must include at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must include at least one number.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must include at least one special character.");

        RuleFor(command => command.Request.ConfirmPassword)
            .Equal(command => command.Request.Password)
            .WithMessage("Password and confirmation password must match.");
    }
}

public sealed class LoginLoginRegistrationPageValidator : AbstractValidator<LoginLoginRegistrationPageCommand>
{
    public LoginLoginRegistrationPageValidator()
    {
        RuleFor(command => command.Request.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Enter a valid email address.")
            .MaximumLength(256).WithMessage("Email must be 256 characters or fewer.");

        RuleFor(command => command.Request.Password)
            .NotEmpty().WithMessage("Password is required.");
    }
}
