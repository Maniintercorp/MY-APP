CREATE PROCEDURE usp_DeleteContact
    @Id INT
AS
BEGIN
    UPDATE Contacts
    SET IsDeleted = 1
    WHERE Id = @Id;
END