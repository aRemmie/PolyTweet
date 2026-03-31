package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type Cache interface {
	HGetAll(ctx context.Context, key string) *redis.MapStringStringCmd
	HSet(ctx context.Context, key string, expiration time.Duration, values ...interface{}) *redis.IntCmd
}

type CacheClient struct {
	*redis.Client
}

func NewCacheClient(ctx context.Context, cfg Config) (*CacheClient, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:         cfg.Addr,
		Password:     cfg.Password,
		DB:           cfg.DB,
		ReadTimeout:  cfg.Timeout,
		WriteTimeout: cfg.Timeout,
	})

	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect redis server: %w", err)
	}

	return &CacheClient{
		Client: rdb,
	}, nil
}

func (c *CacheClient) HGetAll(ctx context.Context, key string) *redis.MapStringStringCmd {
	return c.Client.HGetAll(ctx, key)
}

func (c *CacheClient) HSet(ctx context.Context, key string, expiration time.Duration, values ...interface{}) *redis.IntCmd {
	result := c.Client.HSet(ctx, key, values...)
	c.Expire(ctx, key, expiration)
	return result
}
