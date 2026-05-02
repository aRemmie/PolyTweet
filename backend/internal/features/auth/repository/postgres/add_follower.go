package auth_repository

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (r *AuthRepository) AddFollowerToUser(ctx context.Context, userToFollow, userID string) error {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	tx, err := r.ConnPool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("err begin tx: %w", err)
	}
	defer tx.Rollback(ctxTimeout)

	query1 := `UPDATE users
	SET follows = array_append(COALESCE(follows, '{}'), $1)
	WHERE id = $2 AND NOT ($1 = ANY(COALESCE(follows, '{}')))
	`

	res, err := tx.Exec(ctxTimeout, query1, userToFollow, userID)
	if err != nil {
		return fmt.Errorf("err add follows: %w", err)
	}

	if res.RowsAffected() == 0 {
		return fmt.Errorf("nothing to update: %w", domain.INVALID_REQUEST)
	}

	query2 := `UPDATE users
	SET followed_by = array_append(COALESCE(followed_by, '{}'), $1)
	WHERE id = $2 AND NOT ($1 = ANY(COALESCE(followed_by, '{}')))
	`

	res, err = tx.Exec(ctxTimeout, query2, userID, userToFollow)
	if err != nil {
		return fmt.Errorf("err add follows: %w", err)
	}

	if res.RowsAffected() == 0 {
		return fmt.Errorf("nothing to update: %w", domain.INVALID_REQUEST)
	}

	if err := tx.Commit(ctxTimeout); err != nil {
		return fmt.Errorf("err commit changes: %w", err)
	}

	return nil
}
