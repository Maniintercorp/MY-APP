using FluentValidation;
using MyProject.DTOs;

namespace MyProject.Validators
{
    public class UserProfileUpdateRequestValidator : AbstractValidator<UserProfileUpdateRequest>
    {
        public UserProfileUpdateRequestValidator()
        {
            RuleFor(x => x.Username).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
        }
    }
}