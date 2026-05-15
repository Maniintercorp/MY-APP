CREATE PROCEDURE usp_GetContactById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Name, Email, Message, CreatedAt
    FROM Contacts
    WHERE Id = @Id AND IsDeleted = 0;
END