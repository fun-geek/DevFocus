CREATE DATABASE devfocus;

USE devfocus;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_seconds INT DEFAULT 0,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',

    FOREIGN KEY (user_id)
    REFERENCES users(id)
);

CREATE TABLE interruptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    interrupted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id)
    REFERENCES sessions(id)
);

SHOW TABLES;