package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (r *LikesRepository) RemoveLike(ctx context.Context, like domain.Like) error {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	tx, err := r.ConnPool.Begin(ctxTimeout)
	if err != nil {
		return fmt.Errorf("begin transaction: %w", err)
	}

	defer func() {
		_ = tx.Rollback(ctxTimeout)
	}()

	deleteQuery := `
	DELETE FROM likes 
	WHERE user_id = $1 AND post_id = $2;
	`

	cmdTag, err := tx.Exec(ctxTimeout, deleteQuery, like.UserID, like.PostID)
	if err != nil {
		return fmt.Errorf("remove like: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("like not found")
	}

	updatePostQuery := `
	UPDATE posts
	SET likes_count = likes_count - 1
	WHERE id = $1 AND likes_count > 0;
	`

	cmdTag, err = tx.Exec(ctxTimeout, updatePostQuery, like.PostID)
	if err != nil {
		return fmt.Errorf("update likes_count: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("post not found: %w", err)
	}

	return tx.Commit(ctx)
}
