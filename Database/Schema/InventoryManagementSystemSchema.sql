CREATE TABLE dbo.Users (
    Id INT IDENTITY(1,1) NOT NULL,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(256) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Role NVARCHAR(50) NOT NULL CONSTRAINT DF_Users_Role DEFAULT 'User',
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Users_IsDeleted DEFAULT 0,
    CONSTRAINT PK_Users PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_Users_Email UNIQUE (Email)
);
GO
CREATE TABLE dbo.Categories (
    Id INT IDENTITY(1,1) NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Categories_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Categories_IsDeleted DEFAULT 0,
    CONSTRAINT PK_Categories PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_Categories_Name UNIQUE (Name)
);
GO
CREATE TABLE dbo.Products (
    Id INT IDENTITY(1,1) NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    SKU NVARCHAR(80) NOT NULL,
    CategoryId INT NOT NULL,
    Quantity INT NOT NULL CONSTRAINT DF_Products_Quantity DEFAULT 0,
    UnitPrice DECIMAL(18,2) NOT NULL,
    ReorderLevel INT NOT NULL CONSTRAINT DF_Products_ReorderLevel DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Products_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Products_IsDeleted DEFAULT 0,
    CONSTRAINT PK_Products PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_Products_SKU UNIQUE (SKU),
    CONSTRAINT FK_Products_Categories_CategoryId FOREIGN KEY (CategoryId) REFERENCES dbo.Categories(Id) ON DELETE NO ACTION,
    CONSTRAINT CK_Products_Quantity CHECK (Quantity >= 0),
    CONSTRAINT CK_Products_UnitPrice CHECK (UnitPrice >= 0),
    CONSTRAINT CK_Products_ReorderLevel CHECK (ReorderLevel >= 0)
);
GO
CREATE TABLE dbo.StockMovements (
    Id INT IDENTITY(1,1) NOT NULL,
    ProductId INT NOT NULL,
    MovementType NVARCHAR(20) NOT NULL,
    Quantity INT NOT NULL,
    Reason NVARCHAR(500) NULL,
    MovementDate DATETIME2 NOT NULL,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_StockMovements_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_StockMovements_IsDeleted DEFAULT 0,
    CreatedByUserId INT NULL,
    CONSTRAINT PK_StockMovements PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_StockMovements_Products_ProductId FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_StockMovements_Users_CreatedByUserId FOREIGN KEY (CreatedByUserId) REFERENCES dbo.Users(Id) ON DELETE SET NULL,
    CONSTRAINT CK_StockMovements_Quantity CHECK (Quantity > 0),
    CONSTRAINT CK_StockMovements_MovementType CHECK (MovementType IN ('StockIn','StockOut'))
);
GO
CREATE TABLE dbo.InventoryManagementSystems (
    Id INT IDENTITY(1,1) NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500) NULL,
    Status NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_InventoryManagementSystems_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_InventoryManagementSystems_IsDeleted DEFAULT 0,
    CONSTRAINT PK_InventoryManagementSystems PRIMARY KEY CLUSTERED (Id)
);
GO
CREATE INDEX IX_Users_IsDeleted ON dbo.Users(IsDeleted);
GO
CREATE INDEX IX_Categories_IsDeleted ON dbo.Categories(IsDeleted);
GO
CREATE INDEX IX_Products_CategoryId ON dbo.Products(CategoryId);
GO
CREATE INDEX IX_Products_IsDeleted ON dbo.Products(IsDeleted);
GO
CREATE INDEX IX_StockMovements_ProductId ON dbo.StockMovements(ProductId);
GO
CREATE INDEX IX_StockMovements_CreatedByUserId ON dbo.StockMovements(CreatedByUserId);
GO
CREATE INDEX IX_StockMovements_MovementDate ON dbo.StockMovements(MovementDate);
GO
CREATE INDEX IX_StockMovements_MovementType ON dbo.StockMovements(MovementType);
GO
CREATE INDEX IX_StockMovements_IsDeleted ON dbo.StockMovements(IsDeleted);
GO
CREATE INDEX IX_InventoryManagementSystems_IsDeleted ON dbo.InventoryManagementSystems(IsDeleted);
