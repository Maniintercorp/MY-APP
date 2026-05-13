CREATE PROCEDURE usp_CreateUser
    @Username NVARCHAR(256),
    @PasswordHash NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Users (Username, PasswordHash, CreatedAt, UpdatedAt)
    VALUES (@Username, @PasswordHash, GETDATE(), GETDATE());
END