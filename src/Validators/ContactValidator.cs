using FluentValidation;
using MyProject.DTOs;

namespace MyProject.Validators
{
    public class ContactValidator : AbstractValidator<ContactDto>
    {
        public ContactValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("A valid email is required.");
            RuleFor(x => x.Message).NotEmpty().WithMessage("Message is required.");
        }
    }
}