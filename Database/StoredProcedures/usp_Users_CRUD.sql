CREATE PROCEDURE usp_CreateUser
(
    @UserId UNIQUEIDENTIFIER,
    @Email NVARCHAR(255),
    @PasswordHash VARBINARY(MAX)
)
AS
BEGIN
    INSERT INTO Users (UserId, Email, PasswordHash, CreatedAt, UpdatedAt)
    VALUES (@UserId, @Email, @PasswordHash, GETUTCDATE(), GETUTCDATE());
END

GO

CREATE PROCEDURE usp_ReadUser
(
    @UserId UNIQUEIDENTIFIER
)
AS
BEGIN
    SELECT UserId, Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted
    FROM Users
    WHERE UserId = @UserId AND IsDeleted = 0;
END

GO

CREATE PROCEDURE usp_UpdateUser
(
    @UserId UNIQUEIDENTIFIER,
    @Email NVARCHAR(255),
    @PasswordHash VARBINARY(MAX)
)
AS
BEGIN
    UPDATE Users
    SET Email = @Email, PasswordHash = @PasswordHash, UpdatedAt = GETUTCDATE()
    WHERE UserId = @UserId AND IsDeleted = 0;
END

GO

CREATE PROCEDURE usp_DeleteUser
(
    @UserId UNIQUEIDENTIFIER
)
AS
BEGIN
    UPDATE Users
    SET IsDeleted = 1, UpdatedAt = GETUTCDATE()
    WHERE UserId = @UserId;
END

GO
