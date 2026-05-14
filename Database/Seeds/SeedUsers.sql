INSERT INTO Users (Username, PasswordHash, Email, CreatedAt, UpdatedAt)
VALUES ('admin', 'hashedpassword', 'admin@example.com', GETDATE(), GETDATE());
