CREATE OR ALTER PROCEDURE dbo.usp_UpdateUser
    @Id UNIQUEIDENTIFIER,
    @Username NVARCHAR(50),
    @Email NVARCHAR(100),
    @PasswordHash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Users
    SET Username = @Username,
        Email = @Email,
        PasswordHash = @PasswordHash,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id AND IsDeleted = 0;
END
GO
