CREATE PROCEDURE usp_DeleteContact
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Contacts
    SET IsDeleted = 1, UpdatedAt = GETDATE()
    WHERE Id = @Id;
END