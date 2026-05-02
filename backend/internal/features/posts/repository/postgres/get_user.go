package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	auth_models "github.com/tryingmyb3st/PolyTweet/internal/features/auth/repository"
)

func (r *PostsRepository) GetUserByID(ctx context.Context, userID string) (*domain.User, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	query := `
	SELECT id, username, email, password, role, avatar_url, bio, follows, followed_by, created_at
	FROM users
	WHERE id=$1
	`

	row := r.ConnPool.QueryRow(ctxTimeout, query, userID)

	var model auth_models.UserModel
	err := row.Scan(
		&model.ID,
		&model.Username,
		&model.Email,
		&model.Password,
		&model.Role,
		&model.AvatarURL,
		&model.Bio,
		&model.Follows,
		&model.FollowedBy,
		&model.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("scan returning user: %w", err)
	}

	return &domain.User{
		ID:         model.ID,
		Username:   model.Username,
		Email:      model.Email,
		Password:   model.Password,
		Role:       model.Role,
		AvatarURL:  model.AvatarURL.String,
		Bio:        model.Bio.String,
		Follows:    model.Follows,
		FollowedBy: model.FollowedBy,
		CreatedAt:  model.CreatedAt,
	}, nil
}
