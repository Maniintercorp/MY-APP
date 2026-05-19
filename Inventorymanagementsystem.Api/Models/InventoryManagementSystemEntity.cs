namespace Inventorymanagementsystem.Models;

public class InventoryManagementSystemEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = "Active";
}
