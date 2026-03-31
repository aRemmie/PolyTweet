package auth_cache

import (
	"context"
	"fmt"
	"time"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	auth_models "github.com/tryingmyb3st/PolyTweet/internal/features/auth/repository"
)

func (c *AuthCache) SaveUser(ctx context.Context, user domain.User) error {
	model := auth_models.UserModel{
		ID:        user.ID,
		Email:     user.Email,
		Password:  user.Password,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
	}

	status := c.client.HSet(ctx, model.Email, 6*time.Hour, model)

	if status.Err() != nil {
		return fmt.Errorf("saving to cache: %w", status.Err())
	}

	return nil
}
