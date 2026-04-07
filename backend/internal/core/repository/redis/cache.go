package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type Cache interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) *redis.StatusCmd
	Get(ctx context.Context, key string) *redis.StringCmd
	HGetAll(ctx context.Context, key string) *redis.MapStringStringCmd
	HSet(ctx context.Context, key string, values ...interface{}) *redis.IntCmd
	Pipelined(ctx context.Context, fn func(redis.Pipeliner) error) ([]redis.Cmder, error)
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

func (c *CacheClient) HSet(ctx context.Context, key string, values ...interface{}) *redis.IntCmd {
	result := c.Client.HSet(ctx, key, values...)
	c.Client.Expire(ctx, key, 6*time.Hour)
	return result
}

func (c *CacheClient) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) *redis.StatusCmd {
	return c.Client.Set(ctx, key, value, expiration)
}

func (c *CacheClient) Get(ctx context.Context, key string) *redis.StringCmd {
	return c.Client.Get(ctx, key)
}

func (c *CacheClient) Pipelined(ctx context.Context, fn func(redis.Pipeliner) error) ([]redis.Cmder, error) {
	return c.Client.Pipelined(ctx, fn)
}
