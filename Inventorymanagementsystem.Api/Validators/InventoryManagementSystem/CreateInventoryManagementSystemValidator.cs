using FluentValidation;
using Inventorymanagementsystem.Commands.InventoryManagementSystem;

namespace Inventorymanagementsystem.Validators.InventoryManagementSystem;

public class CreateInventoryManagementSystemValidator : AbstractValidator<CreateInventoryManagementSystemCommand>
{
    public CreateInventoryManagementSystemValidator()
    {
        RuleFor(x => x.Request.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Request.Description).MaximumLength(500);
        RuleFor(x => x.Request.Status).NotEmpty().MaximumLength(50);
    }
}
