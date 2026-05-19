using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.Data;
using Inventorymanagementsystem.Models;

namespace Inventorymanagementsystem.Controllers;

public record DeleteResponse(bool Success, string Message);
public record CategoryRequest(string Name, string? Description);
public record CategoryResponse(int Id, string Name, string? Description, int ProductCount, DateTime CreatedAt, DateTime? UpdatedAt);
public record ProductCreateRequest(string Name, string SKU, int CategoryId, int Quantity, decimal UnitPrice, int ReorderLevel);
public record ProductUpdateRequest(string Name, string SKU, int CategoryId, decimal UnitPrice, int ReorderLevel);
public record ProductResponse(int Id, string Name, string SKU, int CategoryId, string CategoryName, int Quantity, decimal UnitPrice, int ReorderLevel, bool IsLowStock, DateTime CreatedAt, DateTime? UpdatedAt);
public record StockMovementCreateRequest(int ProductId, string MovementType, int Quantity, string? Reason, DateTime MovementDate);
public record StockMovementResponse(int Id, int ProductId, string ProductName, string ProductSku, string MovementType, int Quantity, string? Reason, DateTime MovementDate, DateTime CreatedAt, int? CreatedByUserId, string? CreatedByUserName);
public record StockMovementCreateResponse(int Id, int ProductId, string ProductName, string ProductSku, string MovementType, int Quantity, string? Reason, DateTime MovementDate, int ResultingProductQuantity, DateTime CreatedAt, int? CreatedByUserId, string? CreatedByUserName);
public record LowStockProductResponse(int Id, string Name, string SKU, string CategoryName, int Quantity, int ReorderLevel);
public record RecentStockMovementResponse(int Id, int ProductId, string ProductName, string ProductSku, string MovementType, int Quantity, string? Reason, DateTime MovementDate, DateTime CreatedAt);
public record DashboardSummaryResponse(int TotalProducts, IReadOnlyList<LowStockProductResponse> LowStockProducts, int LowStockTotalCount, IReadOnlyList<RecentStockMovementResponse> RecentStockMovements);

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    public CategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<PagedResult<CategoryResponse>> GetAll([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);
        var query = _db.Categories.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) query = query.Where(x => x.Name.Contains(search) || (x.Description != null && x.Description.Contains(search)));
        var total = await query.CountAsync(ct);
        var items = await query.OrderBy(x => x.Name).Skip((page - 1) * pageSize).Take(pageSize).Select(x => new CategoryResponse(x.Id, x.Name, x.Description, x.Products.Count(p => !p.IsDeleted), x.CreatedAt, x.UpdatedAt)).ToListAsync(ct);
        return new PagedResult<CategoryResponse> { Items = items, Page = page, PageSize = pageSize, TotalCount = total };
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryResponse>> GetById(int id, CancellationToken ct)
    {
        var item = await _db.Categories.AsNoTracking().Where(x => x.Id == id).Select(x => new CategoryResponse(x.Id, x.Name, x.Description, x.Products.Count(p => !p.IsDeleted), x.CreatedAt, x.UpdatedAt)).FirstOrDefaultAsync(ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryResponse>> Create(CategoryRequest request, CancellationToken ct)
    {
        if (await _db.Categories.AnyAsync(x => x.Name == request.Name, ct)) return BadRequest(new { message = "Category name must be unique." });
        var category = new Category { Name = request.Name.Trim(), Description = request.Description };
        _db.Categories.Add(category);
        await _db.SaveChangesAsync(ct);
        var response = new CategoryResponse(category.Id, category.Name, category.Description, 0, category.CreatedAt, category.UpdatedAt);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, response);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CategoryResponse>> Update(int id, CategoryRequest request, CancellationToken ct)
    {
        var category = await _db.Categories.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (category is null) return NotFound();
        if (await _db.Categories.AnyAsync(x => x.Id != id && x.Name == request.Name, ct)) return BadRequest(new { message = "Category name must be unique." });
        category.Name = request.Name.Trim();
        category.Description = request.Description;
        await _db.SaveChangesAsync(ct);
        var count = await _db.Products.CountAsync(x => x.CategoryId == id && !x.IsDeleted, ct);
        return Ok(new CategoryResponse(category.Id, category.Name, category.Description, count, category.CreatedAt, category.UpdatedAt));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<DeleteResponse>> Delete(int id, CancellationToken ct)
    {
        var category = await _db.Categories.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (category is null) return NotFound(new DeleteResponse(false, "Category not found."));
        if (await _db.Products.AnyAsync(x => x.CategoryId == id && !x.IsDeleted, ct)) return BadRequest(new DeleteResponse(false, "Cannot delete category while products exist."));
        category.IsDeleted = true;
        await _db.SaveChangesAsync(ct);
        return Ok(new DeleteResponse(true, "Category deleted successfully."));
    }
}

[ApiController]
[Route("api/products")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProductsController(AppDbContext db) => _db = db;

    private static ProductResponse Map(Product p) => new(p.Id, p.Name, p.SKU, p.CategoryId, p.Category.Name, p.Quantity, p.UnitPrice, p.ReorderLevel, p.Quantity <= p.ReorderLevel, p.CreatedAt, p.UpdatedAt);

    [HttpGet]
    public async Task<PagedResult<ProductResponse>> GetAll([FromQuery] string? search, [FromQuery] int? categoryId, [FromQuery] bool? lowStockOnly, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);
        var query = _db.Products.AsNoTracking().Include(x => x.Category).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) query = query.Where(x => x.Name.Contains(search) || x.SKU.Contains(search));
        if (categoryId.HasValue) query = query.Where(x => x.CategoryId == categoryId.Value);
        if (lowStockOnly == true) query = query.Where(x => x.Quantity <= x.ReorderLevel);
        var total = await query.CountAsync(ct);
        var items = await query.OrderBy(x => x.Name).Skip((page - 1) * pageSize).Take(pageSize).Select(x => Map(x)).ToListAsync(ct);
        return new PagedResult<ProductResponse> { Items = items, Page = page, PageSize = pageSize, TotalCount = total };
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductResponse>> GetById(int id, CancellationToken ct)
    {
        var product = await _db.Products.AsNoTracking().Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id, ct);
        return product is null ? NotFound() : Ok(Map(product));
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponse>> Create(ProductCreateRequest request, CancellationToken ct)
    {
        if (!await _db.Categories.AnyAsync(x => x.Id == request.CategoryId, ct)) return BadRequest(new { message = "Category must exist." });
        if (await _db.Products.AnyAsync(x => x.SKU == request.SKU, ct)) return BadRequest(new { message = "SKU must be unique." });
        var product = new Product { Name = request.Name.Trim(), SKU = request.SKU.Trim(), CategoryId = request.CategoryId, Quantity = request.Quantity, UnitPrice = request.UnitPrice, ReorderLevel = request.ReorderLevel };
        _db.Products.Add(product);
        await _db.SaveChangesAsync(ct);
        product = await _db.Products.Include(x => x.Category).FirstAsync(x => x.Id == product.Id, ct);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, Map(product));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductResponse>> Update(int id, ProductUpdateRequest request, CancellationToken ct)
    {
        var product = await _db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (product is null) return NotFound();
        if (!await _db.Categories.AnyAsync(x => x.Id == request.CategoryId, ct)) return BadRequest(new { message = "Category must exist." });
        if (await _db.Products.AnyAsync(x => x.Id != id && x.SKU == request.SKU, ct)) return BadRequest(new { message = "SKU must be unique." });
        product.Name = request.Name.Trim();
        product.SKU = request.SKU.Trim();
        product.CategoryId = request.CategoryId;
        product.UnitPrice = request.UnitPrice;
        product.ReorderLevel = request.ReorderLevel;
        await _db.SaveChangesAsync(ct);
        product = await _db.Products.Include(x => x.Category).FirstAsync(x => x.Id == id, ct);
        return Ok(Map(product));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<DeleteResponse>> Delete(int id, CancellationToken ct)
    {
        var product = await _db.Products.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (product is null) return NotFound(new DeleteResponse(false, "Product not found."));
        if (await _db.StockMovements.AnyAsync(x => x.ProductId == id && !x.IsDeleted, ct)) return BadRequest(new DeleteResponse(false, "Cannot delete product while stock movement history exists."));
        product.IsDeleted = true;
        await _db.SaveChangesAsync(ct);
        return Ok(new DeleteResponse(true, "Product deleted successfully."));
    }
}

[ApiController]
[Route("api/stock-movements")]
[Authorize]
public class StockMovementsController : ControllerBase
{
    private readonly AppDbContext _db;
    public StockMovementsController(AppDbContext db) => _db = db;

    [HttpPost]
    public async Task<ActionResult<StockMovementCreateResponse>> Create(StockMovementCreateRequest request, CancellationToken ct)
    {
        if (!Enum.TryParse<StockMovementType>(request.MovementType, out var type)) return BadRequest(new { message = "movementType must be StockIn or StockOut." });
        var product = await _db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == request.ProductId, ct);
        if (product is null) return BadRequest(new { message = "Product must exist." });
        if (request.Quantity <= 0) return BadRequest(new { message = "Quantity must be greater than zero." });
        if (type == StockMovementType.StockOut && product.Quantity < request.Quantity) return BadRequest(new { message = "Insufficient product quantity." });
        var userId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var parsed) ? parsed : (int?)null;
        product.Quantity += type == StockMovementType.StockIn ? request.Quantity : -request.Quantity;
        var movement = new StockMovement { ProductId = product.Id, MovementType = type, Quantity = request.Quantity, Reason = request.Reason, MovementDate = request.MovementDate, CreatedByUserId = userId };
        _db.StockMovements.Add(movement);
        await _db.SaveChangesAsync(ct);
        var userName = userId.HasValue ? await _db.Users.Where(x => x.Id == userId.Value).Select(x => x.FullName).FirstOrDefaultAsync(ct) : null;
        return Created(string.Empty, new StockMovementCreateResponse(movement.Id, product.Id, product.Name, product.SKU, type.ToString(), movement.Quantity, movement.Reason, movement.MovementDate, product.Quantity, movement.CreatedAt, userId, userName));
    }

    [HttpGet]
    public async Task<PagedResult<StockMovementResponse>> GetAll([FromQuery] int? productId, [FromQuery] string? movementType, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);
        var query = _db.StockMovements.AsNoTracking().Include(x => x.Product).Include(x => x.CreatedByUser).AsQueryable();
        if (productId.HasValue) query = query.Where(x => x.ProductId == productId.Value);
        if (!string.IsNullOrWhiteSpace(movementType) && Enum.TryParse<StockMovementType>(movementType, out var type)) query = query.Where(x => x.MovementType == type);
        if (startDate.HasValue) query = query.Where(x => x.MovementDate >= startDate.Value);
        if (endDate.HasValue) query = query.Where(x => x.MovementDate <= endDate.Value);
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(x => x.MovementDate).Skip((page - 1) * pageSize).Take(pageSize).Select(x => new StockMovementResponse(x.Id, x.ProductId, x.Product.Name, x.Product.SKU, x.MovementType.ToString(), x.Quantity, x.Reason, x.MovementDate, x.CreatedAt, x.CreatedByUserId, x.CreatedByUser == null ? null : x.CreatedByUser.FullName)).ToListAsync(ct);
        return new PagedResult<StockMovementResponse> { Items = items, Page = page, PageSize = pageSize, TotalCount = total };
    }
}

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    public DashboardController(AppDbContext db) => _db = db;

    [HttpGet("summary")]
    public async Task<DashboardSummaryResponse> Summary([FromQuery] int recentMovementCount = 10, [FromQuery] int lowStockCount = 10, CancellationToken ct = default)
    {
        recentMovementCount = recentMovementCount <= 0 ? 10 : Math.Min(recentMovementCount, 100);
        lowStockCount = lowStockCount <= 0 ? 10 : Math.Min(lowStockCount, 100);
        var totalProducts = await _db.Products.CountAsync(ct);
        var lowStockQuery = _db.Products.AsNoTracking().Include(x => x.Category).Where(x => x.Quantity <= x.ReorderLevel);
        var lowStockTotal = await lowStockQuery.CountAsync(ct);
        var lowStock = await lowStockQuery.OrderBy(x => x.Quantity).Take(lowStockCount).Select(x => new LowStockProductResponse(x.Id, x.Name, x.SKU, x.Category.Name, x.Quantity, x.ReorderLevel)).ToListAsync(ct);
        var recent = await _db.StockMovements.AsNoTracking().Include(x => x.Product).OrderByDescending(x => x.MovementDate).Take(recentMovementCount).Select(x => new RecentStockMovementResponse(x.Id, x.ProductId, x.Product.Name, x.Product.SKU, x.MovementType.ToString(), x.Quantity, x.Reason, x.MovementDate, x.CreatedAt)).ToListAsync(ct);
        return new DashboardSummaryResponse(totalProducts, lowStock, lowStockTotal, recent);
    }
}
