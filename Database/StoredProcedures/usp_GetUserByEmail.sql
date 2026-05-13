CREATE PROCEDURE usp_GetUserByEmail
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UserId, Email, Username, CreatedAt, UpdatedAt
    FROM Users
    WHERE Email = @Email AND IsDeleted = 0;
END;
