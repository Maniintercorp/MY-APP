CREATE TABLE SQLScriptValidationResults (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UploadedAt DATETIME2 DEFAULT GETDATE(),
    IsValid BIT NOT NULL,
    ValidationErrors NVARCHAR(MAX) NULL
);
GO
