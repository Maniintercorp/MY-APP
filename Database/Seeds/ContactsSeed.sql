-- Seed data for Contacts table
INSERT INTO Contacts (Name, Email, Message, CreatedAt, UpdatedAt, IsDeleted)
VALUES ('John Doe', 'johndoe@example.com', 'Hello, this is a message.', GETDATE(), NULL, 0),
       ('Jane Smith', 'janesmith@example.com', 'Another message.', GETDATE(), NULL, 0);