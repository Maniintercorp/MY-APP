CREATE PROCEDURE usp_CreateUser
	@Email NVARCHAR(256),
	@PasswordHash VARBINARY(256)
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO Users (Email, PasswordHash, CreatedAt, UpdatedAt)
	VALUES (@Email, @PasswordHash, GETUTCDATE(), GETUTCDATE());
END
