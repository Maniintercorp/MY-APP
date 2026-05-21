CREATE OR ALTER PROCEDURE dbo.usp_GetUserCredentialsByNormalizedEmail
    @NormalizedEmail NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
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
    FROM dbo.Users
    WHERE NormalizedEmail = @NormalizedEmail
      AND IsDeleted = 0;
END;
GO
