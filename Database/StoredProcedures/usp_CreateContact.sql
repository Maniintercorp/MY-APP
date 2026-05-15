CREATE PROCEDURE usp_CreateContact
    @Name NVARCHAR(255),
    @Email NVARCHAR(255),
    @Message NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Contacts (Name, Email, Message, CreatedAt, UpdatedAt)
    VALUES (@Name, @Email, @Message, GETDATE(), NULL);
END