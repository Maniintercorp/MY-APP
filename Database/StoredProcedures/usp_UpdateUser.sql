CREATE PROCEDURE usp_UpdateUser
    @UserId INT,
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Users
    SET Email = @Email, 
        PasswordHash = @PasswordHash, 
        UpdatedAt = GETUTCDATE()
    WHERE UserId = @UserId AND IsDeleted = 0;
END