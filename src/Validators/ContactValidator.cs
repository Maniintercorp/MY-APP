using FluentValidation;
using MyProject.DTOs;

namespace MyProject.Validators
{
    public class ContactValidator : AbstractValidator<ContactDto>
    {
        public ContactValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.").MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.").EmailAddress().WithMessage("Email is not valid.").MaximumLength(100);
            RuleFor(x => x.Message).NotEmpty().WithMessage("Message is required.");
        }
    }
}
