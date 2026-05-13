CREATE PROCEDURE usp_ReadUser
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UserId, Username, PasswordHash, CreatedAt, UpdatedAt
    FROM Users
    WHERE UserId = @UserId AND IsDeleted = 0;
END