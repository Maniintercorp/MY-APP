using FluentValidation;
using YourApp.DTOs;

namespace YourApp.Validators
{
    public class ProfileUpdateRequestValidator : AbstractValidator<ProfileUpdateRequestDto>
    {
        public ProfileUpdateRequestValidator()
        {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Username).NotEmpty();
        }
    }
}