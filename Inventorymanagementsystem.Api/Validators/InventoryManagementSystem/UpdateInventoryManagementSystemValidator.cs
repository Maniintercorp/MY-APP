using FluentValidation;
using Inventorymanagementsystem.Commands.InventoryManagementSystem;

namespace Inventorymanagementsystem.Validators.InventoryManagementSystem;

public class UpdateInventoryManagementSystemValidator : AbstractValidator<UpdateInventoryManagementSystemCommand>
{
    public UpdateInventoryManagementSystemValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Request.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Request.Description).MaximumLength(500);
        RuleFor(x => x.Request.Status).NotEmpty().MaximumLength(50);
    }
}
