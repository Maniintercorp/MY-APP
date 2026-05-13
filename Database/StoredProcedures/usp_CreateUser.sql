CREATE PROCEDURE usp_CreateUser
    @UserId UNIQUEIDENTIFIER,
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @Username NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Users (UserId, Email, PasswordHash, Username, CreatedAt, UpdatedAt, IsDeleted)
    VALUES (@UserId, @Email, @PasswordHash, @Username, GETDATE(), GETDATE(), 0);
END;
