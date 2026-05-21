CREATE OR ALTER PROCEDURE dbo.usp_RecordUserLogin
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Users
    SET LastLoginAtUtc = SYSUTCDATETIME(),
        UpdatedAtUtc = SYSUTCDATETIME(),
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id
      AND IsDeleted = 0
      AND IsActive = 1;

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
