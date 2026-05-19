namespace Inventorymanagementsystem.Models;

public class ApplicationUser : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
    public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}
