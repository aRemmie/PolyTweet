package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (r *PostsRepository) DeletePost(ctx context.Context, userID, postID string) error {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	query := `
	DELETE FROM posts
	WHERE id = $1 AND user_id = $2;
	`

	row, err := r.ConnPool.Exec(ctxTimeout, query, postID, userID)
	if err != nil {
		return fmt.Errorf("delete post: %w", err)
	}

	if row.RowsAffected() == 0 {
		return domain.NOT_FOUND
	}

	return nil
}
