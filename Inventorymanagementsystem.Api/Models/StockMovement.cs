namespace Inventorymanagementsystem.Models;

public enum StockMovementType
{
    StockIn = 1,
    StockOut = 2
}

public class StockMovement : BaseEntity
{
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public StockMovementType MovementType { get; set; }
    public int Quantity { get; set; }
    public string? Reason { get; set; }
    public DateTime MovementDate { get; set; }
    public int? CreatedByUserId { get; set; }
    public ApplicationUser? CreatedByUser { get; set; }
}
