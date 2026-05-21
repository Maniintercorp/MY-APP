CREATE OR ALTER PROCEDURE dbo.usp_GetUserById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Username, Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted
    FROM dbo.Users
    WHERE Id = @Id AND IsDeleted = 0;
END
GO
