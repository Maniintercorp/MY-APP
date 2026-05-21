CREATE OR ALTER PROCEDURE dbo.usp_DeleteUser
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Users
    SET IsDeleted = 1,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @Id AND IsDeleted = 0;
END
GO
