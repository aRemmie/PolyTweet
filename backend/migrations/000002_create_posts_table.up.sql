CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    content TEXT,
    parent_id VARCHAR(36),
    reply_to VARCHAR(36),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_posts_parent FOREIGN KEY (parent_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_posts_reply_to FOREIGN KEY (reply_to) REFERENCES posts(id) ON DELETE CASCADE
);
