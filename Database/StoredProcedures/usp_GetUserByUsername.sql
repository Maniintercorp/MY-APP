CREATE OR ALTER PROCEDURE dbo.usp_GetUserByUsername
    @Username NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Username, Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Users
    WHERE Username = @Username AND IsDeleted = 0;
END
GO
