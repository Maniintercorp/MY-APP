CREATE PROCEDURE usp_UserLogin
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Username
    FROM Users
    WHERE Email = @Email AND PasswordHash = @PasswordHash AND IsDeleted = 0;
END