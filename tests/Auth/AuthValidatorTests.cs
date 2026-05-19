using FluentAssertions;
using Inventorymanagementsystem.Commands.Auth;
using Inventorymanagementsystem.DTOs.Auth;
using Inventorymanagementsystem.Validators.Auth;

namespace Inventorymanagementsystem.Tests.Auth;

public class AuthValidatorTests
{
    [Fact]
    public void LoginCommandValidator_ShouldRejectInvalidEmailAndShortPassword()
    {
        var validator = new LoginCommandValidator();
        var result = validator.Validate(new LoginCommand(new LoginRequest { Email = "not-an-email", Password = "123" }));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Request.Email");
        result.Errors.Should().Contain(e => e.PropertyName == "Request.Password");
    }

    [Fact]
    public void RegisterCommandValidator_ShouldRejectPasswordMismatch()
    {
        var validator = new RegisterCommandValidator();
        var result = validator.Validate(new RegisterCommand(new RegisterRequest
        {
            FullName = "Jane Doe",
            Email = "jane@example.com",
            Password = "Password123!",
            ConfirmPassword = "Different123!"
        }));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage == "Passwords do not match.");
    }
}
