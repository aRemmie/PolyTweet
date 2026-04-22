package auth_cache

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	auth_models "github.com/tryingmyb3st/PolyTweet/internal/features/auth/repository"
)

func (c *AuthCache) SaveUser(user *domain.User) error {
	model := auth_models.UserModel{
		ID:        user.ID,
		Email:     user.Email,
		Password:  user.Password,
		Role:      user.Role,
		AvatarURL: sql.NullString{String: user.AvatarURL, Valid: user.AvatarURL != ""},
		Bio:       sql.NullString{String: user.Bio, Valid: user.Bio != ""},
		CreatedAt: user.CreatedAt,
	}

	key := fmt.Sprintf("user:%s", model.Email)
	keyByID := fmt.Sprintf("user:id:%s", model.ID)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := c.client.Pipelined(ctx, func(rdb redis.Pipeliner) error {
		rdb.HSet(ctx, key, "id", model.ID)
		rdb.HSet(ctx, key, "password", model.Password)
		rdb.HSet(ctx, key, "role", model.Role)
		rdb.HSet(ctx, key, "avatar_url", model.AvatarURL.String)
		rdb.HSet(ctx, key, "bio", model.Bio.String)
		rdb.HSet(ctx, key, "createdAt", model.CreatedAt)

		rdb.HSet(ctx, keyByID, "id", model.ID)
		rdb.HSet(ctx, keyByID, "email", model.Email)
		rdb.HSet(ctx, keyByID, "password", model.Password)
		rdb.HSet(ctx, keyByID, "role", model.Role)
		rdb.HSet(ctx, keyByID, "avatar_url", model.AvatarURL.String)
		rdb.HSet(ctx, keyByID, "bio", model.Bio.String)
		rdb.HSet(ctx, keyByID, "createdAt", model.CreatedAt)
		return nil
	})

	if err != nil {
		return fmt.Errorf("saving to cache: %w", err)
	}

	return nil
}
