package auth_repository

import (
	"context"
	"fmt"
)

func (r *AuthRepository) UpdateUserProfile(ctx context.Context, userID, avatarURL, bio string) error {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	query := `UPDATE users SET `
	args := []interface{}{}
	argCount := 1

	if avatarURL != "" {
		query += fmt.Sprintf("avatar_url = $%d", argCount)
		args = append(args, avatarURL)
		argCount++
	}

	if bio != "" {
		if argCount > 1 {
			query += ", "
		}
		query += fmt.Sprintf("bio = $%d", argCount)
		args = append(args, bio)
		argCount++
	}

	if argCount == 1 {
		return nil
	}

	query += fmt.Sprintf(" WHERE id = $%d", argCount)
	args = append(args, userID)

	_, err := r.ConnPool.Exec(ctxTimeout, query, args...)
	if err != nil {
		return fmt.Errorf("update user profile: %w", err)
	}

	return nil
}
