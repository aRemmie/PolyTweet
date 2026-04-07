package posts_cache

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (c *PostsCache) GetPostByID(ctx context.Context, postID string) (*domain.Post, error) {
	key := fmt.Sprintf("post:%s", postID)

	data, err := c.client.Get(ctx, key).Result()
	if err != nil {
		return nil, fmt.Errorf("err getting from redis: %w", err)
	}

	var post domain.Post
	if err := json.Unmarshal([]byte(data), &post); err != nil {
		return nil, fmt.Errorf("err unmarshaling post: %w", err)
	}

	return &post, nil
}
