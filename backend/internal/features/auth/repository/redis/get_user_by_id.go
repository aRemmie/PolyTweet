package auth_cache

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (c *AuthCache) GetUserByID(ctx context.Context, userID string) (*domain.User, error) {
	key := fmt.Sprintf("user:id:%s", userID)

	var model UserModel
	err := c.client.HGetAll(ctx, key).Scan(&model)
	if err != nil {
		return nil, fmt.Errorf("get user from cache: %w", err)
	}

	if model.ID == "" {
		return nil, fmt.Errorf("user not found in cache")
	}

	follows, _ := model.GetFollows()
	followedBy, _ := model.GetFollowedBy()

	return &domain.User{
		ID:         model.ID,
		Email:      model.Email,
		Password:   model.Password,
		Role:       model.Role,
		AvatarURL:  model.AvatarURL.String,
		Bio:        model.Bio.String,
		Follows:    follows,
		FollowedBy: followedBy,
		CreatedAt:  model.CreatedAt,
	}, nil
}
