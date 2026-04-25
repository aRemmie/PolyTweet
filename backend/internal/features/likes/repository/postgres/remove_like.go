package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (r *LikesRepository) RemoveLike(ctx context.Context, like domain.Like) (int64, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	tx, err := r.ConnPool.Begin(ctxTimeout)
	if err != nil {
		return 0, fmt.Errorf("begin transaction: %w", err)
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
		return 0, fmt.Errorf("remove like: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return 0, fmt.Errorf("like not found")
	}

	updatePostQuery := `
	UPDATE posts
	SET likes_count = likes_count - 1
	WHERE id = $1 AND likes_count > 0
	RETURNING likes_count;
	`

	var likesCount int64
	err = tx.QueryRow(ctxTimeout, updatePostQuery, like.PostID).Scan(&likesCount)
	if err != nil {
		return 0, fmt.Errorf("update likes_count: %w", err)
	}

	if err = tx.Commit(ctxTimeout); err != nil {
		return 0, fmt.Errorf("commit transaction: %w", err)
	}

	return likesCount, nil
}
