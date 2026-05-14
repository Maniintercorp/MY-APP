-- Seed initial user data
INSERT INTO Users (Email, PasswordHash, CreatedAt, UpdatedAt, IsDeleted)
VALUES ('admin@example.com', HASHBYTES('SHA2_512', 'adminpassword'), GETUTCDATE(), GETUTCDATE(), 0);
