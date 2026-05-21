CREATE OR ALTER PROCEDURE dbo.usp_UpdateUser
    @Id UNIQUEIDENTIFIER,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(256),
    @NormalizedEmail NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM dbo.Users
        WHERE NormalizedEmail = @NormalizedEmail
          AND Id <> @Id
    )
    BEGIN
        THROW 51001, 'A different user with this email already exists.', 1;
    END;

    UPDATE dbo.Users
    SET FirstName = @FirstName,
        LastName = @LastName,
        Email = @Email,
        NormalizedEmail = @NormalizedEmail,
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
