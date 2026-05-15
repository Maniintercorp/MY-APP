using FluentValidation;
using DTOs;

namespace Validators
{
    public class RefreshTokenValidator : AbstractValidator<RefreshTokenDto>
    {
        public RefreshTokenValidator()
        {
            RuleFor(x => x.RefreshToken).NotEmpty();
        }
    }
}
