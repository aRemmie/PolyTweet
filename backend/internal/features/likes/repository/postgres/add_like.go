package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (r *LikesRepository) AddLike(ctx context.Context, like domain.Like) (int64, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	tx, err := r.ConnPool.Begin(ctxTimeout)
	if err != nil {
		return 0, fmt.Errorf("begin transaction: %w", err)
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
		return 0, fmt.Errorf("add like: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		var likesCount int64
		countQuery := `SELECT likes_count FROM posts WHERE id = $1;`
		err = tx.QueryRow(ctxTimeout, countQuery, like.PostID).Scan(&likesCount)
		if err != nil {
			return 0, fmt.Errorf("get likes count: %w", err)
		}
		return likesCount, tx.Commit(ctxTimeout)
	}

	updatePostQuery := `
	UPDATE posts
	SET likes_count = likes_count + 1
	WHERE id = $1
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
