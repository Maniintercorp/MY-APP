CREATE OR ALTER PROCEDURE dbo.usp_InsertUser
    @Username NVARCHAR(50),
    @Email NVARCHAR(100),
    @PasswordHash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.Users (Id, Username, Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted)
    VALUES (NEWID(), @Username, @Email, @PasswordHash, SYSUTCDATETIME(), SYSUTCDATETIME(), 0);
END
GO
