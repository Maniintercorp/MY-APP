CREATE PROCEDURE usp_ReadContact
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Name, Email, Message, CreatedAt, UpdatedAt, IsDeleted
    FROM Contacts
    WHERE Id = @Id AND IsDeleted = 0;
END
GO
