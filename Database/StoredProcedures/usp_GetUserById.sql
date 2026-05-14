CREATE PROCEDURE usp_GetUserById
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT UserId, Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted
    FROM Users
    WHERE UserId = @UserId AND IsDeleted = 0;
END