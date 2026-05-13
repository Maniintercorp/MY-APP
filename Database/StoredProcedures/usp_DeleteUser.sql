CREATE PROCEDURE usp_DeleteUser
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Users
    SET IsDeleted = 1,
        UpdatedAt = GETDATE()
    WHERE UserId = @UserId;
END;
