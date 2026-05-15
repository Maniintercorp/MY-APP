CREATE PROCEDURE usp_RefreshToken
    @UserId INT,
    @Token NVARCHAR(255),
    @ExpirationDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO RefreshTokens (UserId, Token, ExpirationDate, CreatedAt, UpdatedAt)
    VALUES (@UserId, @Token, @ExpirationDate, GETDATE(), GETDATE());
END