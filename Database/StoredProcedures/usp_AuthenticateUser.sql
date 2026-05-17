CREATE PROCEDURE usp_AuthenticateUser
    @Username NVARCHAR(50),
    @PasswordHash NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Username, Email, CreatedAt, UpdatedAt
    FROM Users
    WHERE Username = @Username AND PasswordHash = @PasswordHash AND IsDeleted = 0;
END
GO
