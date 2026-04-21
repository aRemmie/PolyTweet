package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (r *LikesRepository) AddLike(ctx context.Context, like domain.Like) error {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	tx, err := r.ConnPool.Begin(ctxTimeout)
	if err != nil {
		return fmt.Errorf("begin transaction: %w", err)
	}

	defer func() {
		_ = tx.Rollback(ctxTimeout)
	}()

	insertQuery := `
	INSERT INTO likes
	VALUES ($1, $2)
	ON CONFLICT (user_id, post_id) DO NOTHING;
	`

	cmdTag, err := tx.Exec(ctxTimeout, insertQuery, like.UserID, like.PostID)
	if err != nil {
		return fmt.Errorf("add like: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return tx.Commit(ctxTimeout)
	}

	updatePostQuery := `
	UPDATE posts
	SET likes_count = likes_count + 1
	WHERE id = $1;
	`

	cmdTag, err = tx.Exec(ctxTimeout, updatePostQuery, like.PostID)
	if err != nil {
		return fmt.Errorf("update likes_count: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("post not found: %w", err)
	}

	return tx.Commit(ctxTimeout)
}
