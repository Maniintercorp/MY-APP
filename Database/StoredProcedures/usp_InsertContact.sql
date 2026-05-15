CREATE PROCEDURE usp_InsertContact
    @Name NVARCHAR(100),
    @Email NVARCHAR(100),
    @Message NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Contacts (Name, Email, Message, CreatedAt)
    VALUES (@Name, @Email, @Message, GETDATE());
END