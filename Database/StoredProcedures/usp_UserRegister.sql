CREATE PROCEDURE usp_UserRegister
    @Username NVARCHAR(100),
    @PasswordHash NVARCHAR(255),
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Users (Username, PasswordHash, Email, CreatedDate, CreatedAt, UpdatedAt)
    VALUES (@Username, @PasswordHash, @Email, GETDATE(), GETDATE(), GETDATE());
END