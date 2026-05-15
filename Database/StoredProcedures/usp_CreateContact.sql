CREATE PROCEDURE usp_CreateContact
    @Name NVARCHAR(100),
    @Email NVARCHAR(100),
    @Message NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Contacts (Name, Email, Message, CreatedAt, UpdatedAt)
    VALUES (@Name, @Email, @Message, GETDATE(), GETDATE());
END
GO
