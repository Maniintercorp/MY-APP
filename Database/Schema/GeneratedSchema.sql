-- CREATE TABLE for Users table
CREATE TABLE Users
(
    UserId UNIQUEIDENTIFIER PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL,
    PasswordHash VARBINARY(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL,
    IsDeleted BIT DEFAULT 0,
    INDEX IX_Users_Email (Email)
);
GO

-- Analysed stored procedures: usp_CreateUser, usp_ReadUser, usp_UpdateUser, usp_DeleteUser
