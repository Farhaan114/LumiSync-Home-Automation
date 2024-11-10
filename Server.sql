-- create database 
create database	login;

-- use database
use login;



-- 1. create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);


-- 2. create a table to log attempts
CREATE TABLE login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('success', 'failure') NOT NULL
);

select * from login_attempts; -- to check the login attempts.
select * from users; -- to check users table

