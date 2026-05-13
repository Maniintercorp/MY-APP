CREATE PROCEDURE usp_UpdateUser
    @UserId UNIQUEIDENTIFIER,
    @Username NVARCHAR(100),
    @Email NVARCHAR(255),
    @PasswordHash VARBINARY(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET Username = @Username,
        Email = @Email,
        PasswordHash = @PasswordHash,
        UpdatedAt = GETDATE()
    WHERE UserId = @UserId AND IsDeleted = 0;
END