CREATE OR ALTER PROCEDURE dbo.usp_CreateUser
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(256),
    @NormalizedEmail NVARCHAR(256),
    @PasswordHash NVARCHAR(500),
    @Id UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Id IS NULL
        SET @Id = NEWID();

    IF EXISTS (
        SELECT 1
        FROM dbo.Users
        WHERE NormalizedEmail = @NormalizedEmail
    )
    BEGIN
        THROW 51000, 'A user with this email already exists.', 1;
    END;

    INSERT INTO dbo.Users (
        Id,
        FirstName,
        LastName,
        Email,
        NormalizedEmail,
        PasswordHash,
        IsActive,
        CreatedAtUtc,
        UpdatedAtUtc,
        LastLoginAtUtc,
        CreatedAt,
        UpdatedAt,
        IsDeleted
    )
    VALUES (
        @Id,
        @FirstName,
        @LastName,
        @Email,
        @NormalizedEmail,
        @PasswordHash,
        1,
        SYSUTCDATETIME(),
        NULL,
        NULL,
        SYSUTCDATETIME(),
        NULL,
        0
    );

    SELECT
        Id,
        FirstName,
        LastName,
        Email,
        NormalizedEmail,
        IsActive,
        CreatedAtUtc,
        UpdatedAtUtc,
        LastLoginAtUtc,
        CreatedAt,
        UpdatedAt,
        IsDeleted
    FROM dbo.Users
    WHERE Id = @Id;
END;
GO
