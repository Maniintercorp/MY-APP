CREATE PROCEDURE usp_UpdateContact
    @Id INT,
    @Name NVARCHAR(255),
    @Email NVARCHAR(255),
    @Message NVARCHAR(MAX)
AS
BEGIN
    UPDATE Contacts
    SET Name = @Name,
        Email = @Email,
        Message = @Message,
        UpdatedAt = GETDATE()
    WHERE Id = @Id;
END