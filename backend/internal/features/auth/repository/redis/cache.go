package auth_cache

import cache "github.com/tryingmyb3st/PolyTweet/internal/core/repository/redis"

type AuthCache struct {
	client cache.Cache
}

func NewAuthCache(cl cache.Cache) *AuthCache {
	return &AuthCache{
		client: cl,
	}
}
