IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO
CREATE TABLE dbo.Users (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Users_Id DEFAULT NEWID(),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(256) NOT NULL,
    NormalizedEmail NVARCHAR(256) NOT NULL,
    PasswordHash NVARCHAR(500) NOT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT 1,
    CreatedAtUtc DATETIME2 NOT NULL CONSTRAINT DF_Users_CreatedAtUtc DEFAULT SYSUTCDATETIME(),
    UpdatedAtUtc DATETIME2 NULL,
    LastLoginAtUtc DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Users_IsDeleted DEFAULT 0,
    CONSTRAINT PK_Users PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT CK_Users_FirstName_NotEmpty CHECK (LEN(LTRIM(RTRIM(FirstName))) > 0),
    CONSTRAINT CK_Users_LastName_NotEmpty CHECK (LEN(LTRIM(RTRIM(LastName))) > 0),
    CONSTRAINT CK_Users_Email_NotEmpty CHECK (LEN(LTRIM(RTRIM(Email))) > 0),
    CONSTRAINT CK_Users_NormalizedEmail_NotEmpty CHECK (LEN(LTRIM(RTRIM(NormalizedEmail))) > 0),
    CONSTRAINT CK_Users_PasswordHash_NotEmpty CHECK (LEN(LTRIM(RTRIM(PasswordHash))) > 0)
);
GO
CREATE UNIQUE INDEX UX_Users_NormalizedEmail ON dbo.Users (NormalizedEmail);
GO
CREATE INDEX IX_Users_Email ON dbo.Users (Email);
GO
CREATE INDEX IX_Users_IsDeleted_IsActive ON dbo.Users (IsDeleted, IsActive);
GO
CREATE INDEX IX_Users_CreatedAtUtc ON dbo.Users (CreatedAtUtc);
GO
