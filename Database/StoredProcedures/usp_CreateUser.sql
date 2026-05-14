CREATE PROCEDURE usp_CreateUser
    @Username NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Users (Username, PasswordHash, Email, CreatedAt, UpdatedAt)
    VALUES (@Username, @PasswordHash, @Email, GETDATE(), GETDATE());
END;
