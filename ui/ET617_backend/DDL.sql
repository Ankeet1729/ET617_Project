CREATE TABLE transcript (
    quiz_id SERIAL PRIMARY KEY,
    module INT,
    transcript TEXT
);

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password_hash TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    grade INT NULL
);

CREATE TABLE quiz ( username VARCHAR(255) PRIMARY KEY REFERENCES users(username) ON DELETE CASCADE, quiz_data TEXT NOT NULL );