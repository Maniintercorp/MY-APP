CREATE PROCEDURE usp_DeleteSQLScriptValidationResult
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM SQLScriptValidationResults
    WHERE Id = @Id;
END
GO
