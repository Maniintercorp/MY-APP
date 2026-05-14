CREATE PROCEDURE usp_UpdateUser
    @UserId INT,
    @Username NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Users
    SET Username = @Username,
        PasswordHash = @PasswordHash,
        Email = @Email,
        UpdatedAt = GETDATE()
    WHERE UserId = @UserId;
END;
