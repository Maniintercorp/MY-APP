CREATE OR ALTER PROCEDURE dbo.usp_DeleteUser
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Users
    SET IsDeleted = 1,
        IsActive = 0,
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
