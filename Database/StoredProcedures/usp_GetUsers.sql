CREATE OR ALTER PROCEDURE dbo.usp_GetUsers
    @IncludeInactive BIT = 0,
    @IncludeDeleted BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

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
    WHERE (@IncludeDeleted = 1 OR IsDeleted = 0)
      AND (@IncludeInactive = 1 OR IsActive = 1)
    ORDER BY CreatedAtUtc DESC, Id ASC;
END;
GO
