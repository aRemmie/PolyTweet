package auth_cache

import (
	"context"

	"github.com/redis/go-redis/v9"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (c *AuthCache) GetUser(ctx context.Context, email string) (*domain.User, error) {
	data, err := c.client.HGetAll(ctx, email).Result()
	if err != nil {
		return nil, err
	}

	if len(data) == 0 {
		return nil, redis.Nil
	}

	// TODO ADD CREATED_AT

	return &domain.User{
		ID:       data["id"],
		Email:    data["email"],
		Password: data["password"],
		Role:     data["role"],
	}, nil
}
