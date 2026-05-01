package auth_repository

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	auth_models "github.com/tryingmyb3st/PolyTweet/internal/features/auth/repository"
)

func (r *AuthRepository) GetUser(ctx context.Context, email string) (*domain.User, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	query := `
	SELECT id, username, email, password, role, avatar_url, bio, created_at
	FROM users
	WHERE email=$1
	`

	row := r.ConnPool.QueryRow(ctxTimeout, query, email)

	var model auth_models.UserModel
	err := row.Scan(
		&model.ID,
		&model.Username,
		&model.Email,
		&model.Password,
		&model.Role,
		&model.AvatarURL,
		&model.Bio,
		&model.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("scan returning user: %w", err)
	}

	return &domain.User{
		ID:        model.ID,
		Username:  model.Username,
		Email:     model.Email,
		Password:  model.Password,
		Role:      model.Role,
		AvatarURL: model.AvatarURL.String,
		Bio:       model.Bio.String,
		CreatedAt: model.CreatedAt,
	}, nil
}
