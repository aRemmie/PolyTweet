ALTER TABLE posts ADD COLUMN search_vector tsvector;

UPDATE posts p
SET search_vector =
        setweight(to_tsvector('russian', COALESCE(u.username, '')), 'A') ||
        setweight(to_tsvector('russian', COALESCE(p.content, '')), 'B')
FROM users u
WHERE p.user_id = u.id;

CREATE OR REPLACE FUNCTION update_post_search_vector()
    RETURNS TRIGGER AS $$
DECLARE
    user_username TEXT;
BEGIN
    SELECT username INTO user_username FROM users WHERE id = NEW.user_id;

    NEW.search_vector :=
            setweight(to_tsvector('russian', COALESCE(user_username, '')), 'A') ||
            setweight(to_tsvector('russian', COALESCE(NEW.content, '')), 'B');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_search_vector
    BEFORE INSERT OR UPDATE OF user_id, content
    ON posts
    FOR EACH ROW
EXECUTE FUNCTION update_post_search_vector();

CREATE INDEX idx_posts_search_vector
    ON posts USING GIN (search_vector);

CREATE INDEX idx_posts_search_date
    ON posts (created_at DESC)
    WHERE search_vector IS NOT NULL;