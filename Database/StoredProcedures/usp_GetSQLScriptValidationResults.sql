CREATE PROCEDURE usp_GetSQLScriptValidationResults
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, UploadedAt, IsValid, ValidationErrors
    FROM SQLScriptValidationResults
    ORDER BY UploadedAt DESC;
END
GO
