package posts_cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (c *PostsCache) SavePost(post *domain.Post) error {
	jsonPost, err := json.Marshal(*post)
	if err != nil {
		return fmt.Errorf("err marshalling: %w", err)
	}

	key := fmt.Sprintf("post:%s", post.ID)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := c.client.Set(ctx, key, jsonPost, 3*time.Hour).Err(); err != nil {
		return fmt.Errorf("err saving to redis: %w", err)
	}

	return nil
}
