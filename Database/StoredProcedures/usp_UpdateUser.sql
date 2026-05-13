CREATE PROCEDURE usp_UpdateUser
    @UserId INT,
    @Username NVARCHAR(256),
    @PasswordHash NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Users
    SET Username = @Username,
        PasswordHash = @PasswordHash,
        UpdatedAt = GETDATE()
    WHERE UserId = @UserId AND IsDeleted = 0;
END