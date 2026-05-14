CREATE PROCEDURE usp_UpdateUser
	@UserId INT,
	@Email NVARCHAR(256),
	@PasswordHash VARBINARY(256)
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE Users
	SET Email = @Email, 
	    PasswordHash = @PasswordHash, 
	    UpdatedAt = GETUTCDATE()
	WHERE UserId = @UserId;
END
