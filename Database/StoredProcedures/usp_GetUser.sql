CREATE PROCEDURE usp_GetUser
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT UserId, Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted
	FROM Users
	WHERE UserId = @UserId;
END
