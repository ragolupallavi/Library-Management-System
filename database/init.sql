CREATE DATABASE IF NOT EXISTS library_management;

USE library_management;

CREATE TABLE IF NOT EXISTS books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INT NOT NULL,
    available INT NOT NULL
);

INSERT INTO books
(title, author, category, quantity, available)
VALUES
('Java Programming', 'James Gosling', 'Programming', 10, 10),
('Python Basics', 'Guido van Rossum', 'Programming', 8, 8),
('Data Structures', 'Seymour Lipschutz', 'Education', 5, 5),
('Database Management', 'Raghu Ramakrishnan', 'Database', 7, 7),
('Computer Networks', 'Andrew Tanenbaum', 'Networking', 6, 6);