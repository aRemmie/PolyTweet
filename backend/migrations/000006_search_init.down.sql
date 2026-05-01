DROP INDEX IF EXISTS idx_posts_search_vector;
DROP INDEX IF EXISTS idx_posts_search_date;

DROP TRIGGER IF EXISTS trigger_update_post_search_vector ON posts;

DROP FUNCTION IF EXISTS update_post_search_vector();

ALTER TABLE posts DROP COLUMN IF EXISTS search_vector;