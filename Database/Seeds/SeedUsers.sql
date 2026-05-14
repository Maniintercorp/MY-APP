-- Seed data for Users table
-- Placeholder for initial seed data, add desired user entries here
INSERT INTO Users (Email, PasswordHash, CreatedAt, UpdatedAt)
VALUES ('admin@example.com', HASHBYTES('SHA2_256', 'AdminPassword'), GETUTCDATE(), GETUTCDATE());
