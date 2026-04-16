package redis

import cache "github.com/tryingmyb3st/PolyTweet/internal/core/repository/redis"

type LikesCache struct {
	client cache.Cache
}

func NewLikesCache(cl cache.Cache) *LikesCache {
	return &LikesCache{
		client: cl,
	}
}
