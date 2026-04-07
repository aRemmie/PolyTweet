package posts_cache

import cache "github.com/tryingmyb3st/PolyTweet/internal/core/repository/redis"

type PostsCache struct {
	client cache.Cache
}

func NewPostsCache(cl cache.Cache) *PostsCache {
	return &PostsCache{
		client: cl,
	}
}
