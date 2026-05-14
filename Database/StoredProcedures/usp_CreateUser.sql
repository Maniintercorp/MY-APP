CREATE PROCEDURE usp_CreateUser
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Users (Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted)
    VALUES (@Email, @PasswordHash, GETUTCDATE(), GETUTCDATE(), 0);
END