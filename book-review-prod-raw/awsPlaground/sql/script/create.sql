CREATE DATABASE IF NOT EXISTS BookReview;

USE BookReview;

-- users table
CREATE TABLE IF NOT EXISTS users (
    reviewerID VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);
-- users init
LOAD DATA LOCAL INFILE '/home/ubuntu/mysql-review/sql/original_data/user_full.csv' INTO TABLE users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(reviewerID, username, email, password);

-- roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    createdAt DATETIME DEFAULT NULL,
    updatedAt DATETIME DEFAULT NULL
);
-- roles table init
INSERT INTO roles (id, name, createdAt, updatedAt) VALUES (1, "user", NULL, NULL);
INSERT INTO roles (id, name, createdAt, updatedAt) VALUES (2, "moderator", NULL, NULL);
INSERT INTO roles (id, name, createdAt, updatedAt) VALUES (3, "admin", NULL, NULL);

-- userRoles table
CREATE TABLE IF NOT EXISTS userRoles (
    roleId INT REFERENCES roles(id)
        ON DELETE CASCADE,
    reviewerID VARCHAR(255) REFERENCES users(reviewerID)
        ON DELETE CASCADE,
    createdAt DATETIME DEFAULT NULL,
    updatedAt DATETIME DEFAULT NULL
);
-- userRole init
LOAD DATA LOCAL INFILE '/home/ubuntu/mysql-review/sql/original_data/user_role_full.csv' INTO TABLE userRoles
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(roleId, reviewerID, createdAt, updatedAt);

-- reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(255),
    helpful VARCHAR(255),
    overall INT,
    reviewText TEXT,
    reviewTime VARCHAR(255),
    reviewerID VARCHAR(255) REFERENCES users(reviewerID)
        ON DELETE CASCADE,
    reviewerName VARCHAR(255),
    summary VARCHAR(255),
    unixReviewTime INT
);
-- review init
LOAD DATA LOCAL INFILE '/home/ubuntu/mysql-review/sql/original_data/kindle_reviews_cleaned_full.csv' INTO TABLE reviews
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id, asin, helpful, overall, reviewText, reviewTime, reviewerID, reviewerName, summary, unixReviewTime);

-- tiidf table
CREATE TABLE IF NOT EXISTS tfidf (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(255),
    word VARCHAR(255),
    tf FLOAT,
    idf FLOAT,
    tfidf FLOAT
);

-- count table
CREATE TABLE IF NOT EXISTS count (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(255),
    reviewLength VARCHAR(255),
    reviewText TEXT
);
-- count init
LOAD DATA LOCAL INFILE '/home/ubuntu/mysql-review/sql/original_data/review_length_count.csv' INTO TABLE count
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id, asin, reviewLength, reviewText);
