CREATE PROCEDURE usp_AddSQLScriptValidationResult
    @IsValid BIT,
    @ValidationErrors NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO SQLScriptValidationResults (UploadedAt, IsValid, ValidationErrors)
    VALUES (GETDATE(), @IsValid, @ValidationErrors);
END
GO
