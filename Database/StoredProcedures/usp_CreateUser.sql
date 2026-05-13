CREATE PROCEDURE usp_CreateUser
    @UserId UNIQUEIDENTIFIER OUT,
    @Username NVARCHAR(100),
    @Email NVARCHAR(255),
    @PasswordHash VARBINARY(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    SET @UserId = NEWSEQUENTIALID();
    INSERT INTO Users (UserId, Username, Email, PasswordHash, CreatedAt, UpdatedAt)
    VALUES (@UserId, @Username, @Email, @PasswordHash, GETDATE(), GETDATE());
END