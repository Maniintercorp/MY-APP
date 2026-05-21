CREATE OR ALTER PROCEDURE dbo.usp_UpdateUserPasswordHash
    @Id UNIQUEIDENTIFIER,
    @PasswordHash NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Users
    SET PasswordHash = @PasswordHash,
        UpdatedAtUtc = SYSUTCDATETIME(),
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id
      AND IsDeleted = 0;

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
