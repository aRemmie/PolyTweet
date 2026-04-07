package auth_cache

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	auth_models "github.com/tryingmyb3st/PolyTweet/internal/features/auth/repository"
)

func (c *AuthCache) GetUser(ctx context.Context, email string) (*domain.User, error) {
	var result auth_models.UserModel

	key := fmt.Sprintf("user:%s", email)

	if err := c.client.HGetAll(ctx, key).Scan(&result); err != nil {
		return nil, fmt.Errorf("scan from cache: %w", err)
	}

	if result == (auth_models.UserModel{}) {
		return nil, redis.Nil
	}

	return &domain.User{
		ID:        result.ID,
		Email:     email,
		Password:  result.Password,
		Role:      result.Role,
		CreatedAt: result.CreatedAt,
	}, nil
}
