package auth_repository

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (r *AuthRepository) RemoveFollowerFromUser(ctx context.Context, userToFollow, userID string) error {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	tx, err := r.ConnPool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("err begin tx: %w", err)
	}
	defer tx.Rollback(ctxTimeout)

	query1 := `UPDATE users
	SET follows = array_remove(follows, $1)
	WHERE id = $2
	`

	res, err := tx.Exec(ctxTimeout, query1, userToFollow, userID)
	if err != nil {
		return fmt.Errorf("err remove follows: %w", err)
	}

	if res.RowsAffected() == 0 {
		return fmt.Errorf("nothing to update: %w", domain.INVALID_REQUEST)
	}

	query2 := `UPDATE users
	SET followed_by =  array_remove(followed_by, $1)
	WHERE id = $2
	`

	res, err = tx.Exec(ctxTimeout, query2, userID, userToFollow)
	if err != nil {
		return fmt.Errorf("err remove follows: %w", err)
	}

	if res.RowsAffected() == 0 {
		return fmt.Errorf("nothing to update: %w", domain.INVALID_REQUEST)
	}

	if err := tx.Commit(ctxTimeout); err != nil {
		return fmt.Errorf("err commit changes: %w", err)
	}

	return nil
}
