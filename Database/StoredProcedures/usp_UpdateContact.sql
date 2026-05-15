CREATE PROCEDURE usp_UpdateContact
    @Id INT,
    @Name NVARCHAR(100),
    @Email NVARCHAR(100),
    @Message NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Contacts
    SET Name = @Name,
        Email = @Email,
        Message = @Message,
        UpdatedAt = GETDATE()
    WHERE Id = @Id AND IsDeleted = 0;
END
GO
