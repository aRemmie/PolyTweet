package postgres

import (
	"context"
	"fmt"
)

func (r *LikesRepository) IsLiked(ctx context.Context, userID, postID string) (bool, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	query := `SELECT EXISTS(SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2)`

	var exists bool
	err := r.ConnPool.QueryRow(ctxTimeout, query, userID, postID).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("check is liked: %w", err)
	}

	return exists, nil
}
