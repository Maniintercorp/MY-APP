-- Seed data for Contacts table
INSERT INTO Contacts (Name, Email, Message, CreatedAt)
VALUES
('John Doe', 'john.doe@example.com', 'Hello World!', GETDATE()),
('Jane Smith', 'jane.smith@example.com', 'Contact me for more info.', GETDATE());