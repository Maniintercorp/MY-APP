using FluentAssertions;
using Inventorymanagementsystem.Commands.InventoryManagementSystem;
using Inventorymanagementsystem.DTOs.InventoryManagementSystem;
using Inventorymanagementsystem.Validators.InventoryManagementSystem;

namespace Inventorymanagementsystem.Tests.InventoryManagementSystem;

public class InventoryManagementSystemValidatorTests
{
    [Fact]
    public void CreateValidator_ShouldRejectEmptyNameAndTooLongDescription()
    {
        var validator = new CreateInventoryManagementSystemValidator();
        var command = new CreateInventoryManagementSystemCommand(new CreateInventoryManagementSystemRequest
        {
            Name = "",
            Description = new string('x', 501),
            Status = "Active"
        });

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Request.Name");
        result.Errors.Should().Contain(e => e.PropertyName == "Request.Description");
    }

    [Fact]
    public void UpdateValidator_ShouldRejectInvalidIdAndEmptyStatus()
    {
        var validator = new UpdateInventoryManagementSystemValidator();
        var command = new UpdateInventoryManagementSystemCommand(0, new UpdateInventoryManagementSystemRequest
        {
            Name = "Valid",
            Status = ""
        });

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Id");
        result.Errors.Should().Contain(e => e.PropertyName == "Request.Status");
    }
}
