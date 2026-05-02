package auth_cache

import (
	"context"
	"fmt"
	"reflect"

	"github.com/redis/go-redis/v9"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (c *AuthCache) GetUser(ctx context.Context, email string) (*domain.User, error) {
	var result UserModel

	key := fmt.Sprintf("user:%s", email)

	if err := c.client.HGetAll(ctx, key).Scan(&result); err != nil {
		return nil, fmt.Errorf("scan from cache: %w", err)
	}

	if reflect.DeepEqual(result, UserModel{}) {
		return nil, redis.Nil
	}

	follows, _ := result.GetFollows()
	followedBy, _ := result.GetFollowedBy()

	return &domain.User{
		ID:         result.ID,
		Email:      email,
		Password:   result.Password,
		Role:       result.Role,
		AvatarURL:  result.AvatarURL.String,
		Bio:        result.Bio.String,
		Follows:    follows,
		FollowedBy: followedBy,
		CreatedAt:  result.CreatedAt,
	}, nil
}
