CREATE DATABASE IF NOT EXISTS mvc_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE mvc_demo;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) DEFAULT '',
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create an admin user (password: admin123)
INSERT INTO users (email,password,name,role) VALUES ('admin@example.com', '{PASSWORD_HASH}', 'Administrator', 'admin');
