CREATE PROCEDURE usp_UpdateSQLScriptValidationResult
    @Id INT,
    @IsValid BIT,
    @ValidationErrors NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE SQLScriptValidationResults
    SET IsValid = @IsValid,
        ValidationErrors = @ValidationErrors
    WHERE Id = @Id;
END
GO
