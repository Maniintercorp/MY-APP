CREATE PROCEDURE usp_GetUserById
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserId, Username, Email, CreatedAt, UpdatedAt
    FROM Users
    WHERE UserId = @UserId AND IsDeleted = 0;
END