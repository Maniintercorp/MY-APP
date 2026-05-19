CREATE OR ALTER PROCEDURE dbo.usp_CreateUser
    @FullName NVARCHAR(150),
    @Email NVARCHAR(256),
    @PasswordHash NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Users (FullName, Email, PasswordHash)
    VALUES (@FullName, @Email, @PasswordHash);

    SELECT Id, FullName, Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Users
    WHERE Id = SCOPE_IDENTITY();
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_GetUserById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, FullName, Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Users
    WHERE Id = @Id AND IsDeleted = 0;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_ListUsers
    @IncludeDeleted BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, FullName, Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Users
    WHERE @IncludeDeleted = 1 OR IsDeleted = 0
    ORDER BY FullName, Id;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_UpdateUser
    @Id INT,
    @FullName NVARCHAR(150),
    @Email NVARCHAR(256),
    @PasswordHash NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Users
    SET FullName = @FullName,
        Email = @Email,
        PasswordHash = @PasswordHash,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id AND IsDeleted = 0;

    SELECT Id, FullName, Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Users
    WHERE Id = @Id;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_DeleteUser
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Users
    SET IsDeleted = 1,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id AND IsDeleted = 0;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_CreateCategory
    @Name NVARCHAR(100),
    @Description NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Categories (Name, Description)
    VALUES (@Name, @Description);

    SELECT Id, Name, Description, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Categories
    WHERE Id = SCOPE_IDENTITY();
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_GetCategoryById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Name, Description, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Categories
    WHERE Id = @Id AND IsDeleted = 0;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_ListCategories
    @IncludeDeleted BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Name, Description, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Categories
    WHERE @IncludeDeleted = 1 OR IsDeleted = 0
    ORDER BY Name, Id;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_UpdateCategory
    @Id INT,
    @Name NVARCHAR(100),
    @Description NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Categories
    SET Name = @Name,
        Description = @Description,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id AND IsDeleted = 0;

    SELECT Id, Name, Description, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Categories
    WHERE Id = @Id;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_DeleteCategory
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.Products WHERE CategoryId = @Id AND IsDeleted = 0)
    BEGIN
        THROW 51001, 'Cannot delete category while active products exist.', 1;
    END;

    UPDATE dbo.Categories
    SET IsDeleted = 1,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id AND IsDeleted = 0;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_CreateProduct
    @Name NVARCHAR(200),
    @SKU NVARCHAR(80),
    @CategoryId INT,
    @Quantity INT = 0,
    @UnitPrice DECIMAL(18,2),
    @ReorderLevel INT = 0
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Id = @CategoryId AND IsDeleted = 0)
    BEGIN
        THROW 51002, 'Category does not exist or is deleted.', 1;
    END;

    INSERT INTO dbo.Products (Name, SKU, CategoryId, Quantity, UnitPrice, ReorderLevel)
    VALUES (@Name, @SKU, @CategoryId, @Quantity, @UnitPrice, @ReorderLevel);

    SELECT Id, Name, SKU, CategoryId, Quantity, UnitPrice, ReorderLevel, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Products
    WHERE Id = SCOPE_IDENTITY();
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_GetProductById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Name, SKU, CategoryId, Quantity, UnitPrice, ReorderLevel, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Products
    WHERE Id = @Id AND IsDeleted = 0;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_ListProducts
    @CategoryId INT = NULL,
    @SKU NVARCHAR(80) = NULL,
    @IncludeDeleted BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Name, SKU, CategoryId, Quantity, UnitPrice, ReorderLevel, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Products
    WHERE (@IncludeDeleted = 1 OR IsDeleted = 0)
      AND (@CategoryId IS NULL OR CategoryId = @CategoryId)
      AND (@SKU IS NULL OR SKU = @SKU)
    ORDER BY Name, Id;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_UpdateProduct
    @Id INT,
    @Name NVARCHAR(200),
    @SKU NVARCHAR(80),
    @CategoryId INT,
    @Quantity INT,
    @UnitPrice DECIMAL(18,2),
    @ReorderLevel INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Id = @CategoryId AND IsDeleted = 0)
    BEGIN
        THROW 51003, 'Category does not exist or is deleted.', 1;
    END;

    UPDATE dbo.Products
    SET Name = @Name,
        SKU = @SKU,
        CategoryId = @CategoryId,
        Quantity = @Quantity,
        UnitPrice = @UnitPrice,
        ReorderLevel = @ReorderLevel,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id AND IsDeleted = 0;

    SELECT Id, Name, SKU, CategoryId, Quantity, UnitPrice, ReorderLevel, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Products
    WHERE Id = @Id;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_DeleteProduct
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.StockMovements WHERE ProductId = @Id AND IsDeleted = 0)
    BEGIN
        THROW 51004, 'Cannot delete product while active stock movements exist.', 1;
    END;

    UPDATE dbo.Products
    SET IsDeleted = 1,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id AND IsDeleted = 0;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_CreateStockMovement
    @ProductId INT,
    @MovementType NVARCHAR(20),
    @Quantity INT,
    @Reason NVARCHAR(500) = NULL,
    @MovementDate DATETIME2 = NULL,
    @CreatedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF @MovementType NOT IN ('StockIn','StockOut')
    BEGIN
        THROW 51005, 'MovementType must be StockIn or StockOut.', 1;
    END;

    IF @Quantity <= 0
    BEGIN
        THROW 51006, 'Quantity must be greater than zero.', 1;
    END;

    BEGIN TRANSACTION;

    IF NOT EXISTS (SELECT 1 FROM dbo.Products WITH (UPDLOCK, HOLDLOCK) WHERE Id = @ProductId AND IsDeleted = 0)
    BEGIN
        THROW 51007, 'Product does not exist or is deleted.', 1;
    END;

    IF @CreatedByUserId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Id = @CreatedByUserId AND IsDeleted = 0)
    BEGIN
        THROW 51008, 'CreatedByUserId does not reference an active user.', 1;
    END;

    IF @MovementType = 'StockOut' AND EXISTS (SELECT 1 FROM dbo.Products WHERE Id = @ProductId AND Quantity < @Quantity)
    BEGIN
        THROW 51009, 'Insufficient product quantity for stock out.', 1;
    END;

    UPDATE dbo.Products
    SET Quantity = CASE WHEN @MovementType = 'StockIn' THEN Quantity + @Quantity ELSE Quantity - @Quantity END,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @ProductId;

    INSERT INTO dbo.StockMovements (ProductId, MovementType, Quantity, Reason, MovementDate, CreatedByUserId)
    VALUES (@ProductId, @MovementType, @Quantity, @Reason, COALESCE(@MovementDate, SYSUTCDATETIME()), @CreatedByUserId);

    SELECT Id, ProductId, MovementType, Quantity, Reason, MovementDate, CreatedAt, UpdatedAt, IsDeleted, CreatedByUserId
    FROM dbo.StockMovements
    WHERE Id = SCOPE_IDENTITY();

    COMMIT TRANSACTION;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_GetStockMovementById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, ProductId, MovementType, Quantity, Reason, MovementDate, CreatedAt, UpdatedAt, IsDeleted, CreatedByUserId
    FROM dbo.StockMovements
    WHERE Id = @Id AND IsDeleted = 0;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_ListStockMovements
    @ProductId INT = NULL,
    @MovementType NVARCHAR(20) = NULL,
    @FromMovementDate DATETIME2 = NULL,
    @ToMovementDate DATETIME2 = NULL,
    @IncludeDeleted BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, ProductId, MovementType, Quantity, Reason, MovementDate, CreatedAt, UpdatedAt, IsDeleted, CreatedByUserId
    FROM dbo.StockMovements
    WHERE (@IncludeDeleted = 1 OR IsDeleted = 0)
      AND (@ProductId IS NULL OR ProductId = @ProductId)
      AND (@MovementType IS NULL OR MovementType = @MovementType)
      AND (@FromMovementDate IS NULL OR MovementDate >= @FromMovementDate)
      AND (@ToMovementDate IS NULL OR MovementDate <= @ToMovementDate)
    ORDER BY MovementDate DESC, Id DESC;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_UpdateStockMovement
    @Id INT,
    @ProductId INT,
    @MovementType NVARCHAR(20),
    @Quantity INT,
    @Reason NVARCHAR(500) = NULL,
    @MovementDate DATETIME2,
    @CreatedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @OldProductId INT;
    DECLARE @OldMovementType NVARCHAR(20);
    DECLARE @OldQuantity INT;
    DECLARE @OldDelta INT;
    DECLARE @NewDelta INT;

    IF @MovementType NOT IN ('StockIn','StockOut')
    BEGIN
        THROW 51010, 'MovementType must be StockIn or StockOut.', 1;
    END;

    IF @Quantity <= 0
    BEGIN
        THROW 51011, 'Quantity must be greater than zero.', 1;
    END;

    BEGIN TRANSACTION;

    SELECT @OldProductId = ProductId,
           @OldMovementType = MovementType,
           @OldQuantity = Quantity
    FROM dbo.StockMovements WITH (UPDLOCK, HOLDLOCK)
    WHERE Id = @Id AND IsDeleted = 0;

    IF @OldProductId IS NULL
    BEGIN
        THROW 51012, 'Stock movement does not exist or is deleted.', 1;
    END;

    IF NOT EXISTS (SELECT 1 FROM dbo.Products WITH (UPDLOCK, HOLDLOCK) WHERE Id = @ProductId AND IsDeleted = 0)
    BEGIN
        THROW 51013, 'Product does not exist or is deleted.', 1;
    END;

    IF @CreatedByUserId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Id = @CreatedByUserId AND IsDeleted = 0)
    BEGIN
        THROW 51014, 'CreatedByUserId does not reference an active user.', 1;
    END;

    SET @OldDelta = CASE WHEN @OldMovementType = 'StockIn' THEN @OldQuantity ELSE -@OldQuantity END;
    SET @NewDelta = CASE WHEN @MovementType = 'StockIn' THEN @Quantity ELSE -@Quantity END;

    IF @OldProductId = @ProductId
    BEGIN
        IF EXISTS (SELECT 1 FROM dbo.Products WHERE Id = @ProductId AND Quantity + @NewDelta - @OldDelta < 0)
        BEGIN
            THROW 51015, 'Stock movement update would make product quantity negative.', 1;
        END;

        UPDATE dbo.Products
        SET Quantity = Quantity + @NewDelta - @OldDelta,
            UpdatedAt = SYSUTCDATETIME()
        WHERE Id = @ProductId;
    END
    ELSE
    BEGIN
        IF EXISTS (SELECT 1 FROM dbo.Products WHERE Id = @OldProductId AND Quantity - @OldDelta < 0)
        BEGIN
            THROW 51016, 'Reversing old stock movement would make old product quantity negative.', 1;
        END;

        IF EXISTS (SELECT 1 FROM dbo.Products WHERE Id = @ProductId AND Quantity + @NewDelta < 0)
        BEGIN
            THROW 51017, 'Applying new stock movement would make new product quantity negative.', 1;
        END;

        UPDATE dbo.Products
        SET Quantity = Quantity - @OldDelta,
            UpdatedAt = SYSUTCDATETIME()
        WHERE Id = @OldProductId;

        UPDATE dbo.Products
        SET Quantity = Quantity + @NewDelta,
            UpdatedAt = SYSUTCDATETIME()
        WHERE Id = @ProductId;
    END;

    UPDATE dbo.StockMovements
    SET ProductId = @ProductId,
        MovementType = @MovementType,
        Quantity = @Quantity,
        Reason = @Reason,
        MovementDate = @MovementDate,
        CreatedByUserId = @CreatedByUserId,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id;

    SELECT Id, ProductId, MovementType, Quantity, Reason, MovementDate, CreatedAt, UpdatedAt, IsDeleted, CreatedByUserId
    FROM dbo.StockMovements
    WHERE Id = @Id;

    COMMIT TRANSACTION;
END;
GO
CREATE OR ALTER PROCEDURE dbo.usp_DeleteStockMovement
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @ProductId INT;
    DECLARE @MovementType NVARCHAR(20);
    DECLARE @Quantity INT;
    DECLARE @Delta INT;

    BEGIN TRANSACTION;

    SELECT @ProductId = ProductId,
           @MovementType = MovementType,
           @Quantity = Quantity
    FROM dbo.StockMovements WITH (UPDLOCK, HOLDLOCK)
    WHERE Id = @Id AND IsDeleted = 0;

    IF @ProductId IS NULL
    BEGIN
        THROW 51018, 'Stock movement does not exist or is already deleted.', 1;
    END;

    SET @Delta = CASE WHEN @MovementType = 'StockIn' THEN -@Quantity ELSE @Quantity END;

    IF EXISTS (SELECT 1 FROM dbo.Products WITH (UPDLOCK, HOLDLOCK) WHERE Id = @ProductId AND Quantity + @Delta < 0)
    BEGIN
        THROW 51019, 'Deleting stock movement would make product quantity negative.', 1;
    END;

    UPDATE dbo.Products
    SET Quantity = Quantity + @Delta,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @ProductId;

    UPDATE dbo.StockMovements
    SET IsDeleted = 1,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id;

    COMMIT TRANSACTION;
END;