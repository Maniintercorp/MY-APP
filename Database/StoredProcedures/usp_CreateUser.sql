CREATE PROCEDURE usp_CreateUser
    @Username NVARCHAR(50),
    @PasswordHash NVARCHAR(256),
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Users (Username, PasswordHash, Email, CreatedAt, UpdatedAt)
    VALUES (@Username, @PasswordHash, @Email, SYSDATETIME(), NULL);
END
GO
