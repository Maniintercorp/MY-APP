CREATE PROCEDURE usp_DeleteUser
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET IsDeleted = 1, 
        UpdatedAt = GETUTCDATE()
    WHERE UserId = @UserId;
END