CREATE PROCEDURE usp_ValidateUserCredentials
    @Username NVARCHAR(255),
    @PasswordHash VARBINARY(256)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserId
    FROM Users
    WHERE Username = @Username
      AND PasswordHash = @PasswordHash
      AND IsDeleted = 0;
END