ALTER TABLE users ADD COLUMN username VARCHAR(15) UNIQUE NOT NULL CHECK (char_length(username) >= 4);

INSERT INTO users(id, email, password, role, username)
VALUES('8794e589-0ddb-43ce-9f92-16faafcf4ee4', 'test.user@email.com', 'somepass', 'user', 'username');

INSERT INTO users(id, email, password, role, username)
VALUES('249be7cf-d419-4c54-97f2-d04107806e36', 'test.admin@email.com', 'somepass', 'admin', 'adminame');