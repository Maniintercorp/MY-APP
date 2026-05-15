CREATE PROCEDURE usp_ReadContact
    @Id INT
AS
BEGIN
    SELECT Id, Name, Email, Message, CreatedAt, UpdatedAt, IsDeleted
    FROM Contacts
    WHERE Id = @Id;
END