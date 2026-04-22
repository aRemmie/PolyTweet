package auth_cache

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	auth_models "github.com/tryingmyb3st/PolyTweet/internal/features/auth/repository"
)

func (c *AuthCache) GetUserByID(ctx context.Context, userID string) (*domain.User, error) {
	key := fmt.Sprintf("user:id:%s", userID)

	var model auth_models.UserModel
	err := c.client.HGetAll(ctx, key).Scan(&model)
	if err != nil {
		return nil, fmt.Errorf("get user from cache: %w", err)
	}

	if model.ID == "" {
		return nil, fmt.Errorf("user not found in cache")
	}

	return &domain.User{
		ID:        model.ID,
		Email:     model.Email,
		Password:  model.Password,
		Role:      model.Role,
		AvatarURL: model.AvatarURL.String,
		Bio:       model.Bio.String,
		CreatedAt: model.CreatedAt,
	}, nil
}
