using DTOs;
using FluentValidation;

namespace Validators
{
    public class ContactValidator : AbstractValidator<ContactDTO>
    {
        public ContactValidator()
        {
            RuleFor(contact => contact.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

            RuleFor(contact => contact.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.")
                .MaximumLength(100).WithMessage("Email cannot exceed 100 characters.");

            RuleFor(contact => contact.Message)
                .NotEmpty().WithMessage("Message is required.")
                .MaximumLength(500).WithMessage("Message cannot exceed 500 characters.");
        }
    }
}
