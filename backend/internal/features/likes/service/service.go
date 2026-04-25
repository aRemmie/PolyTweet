package service

import (
	"context"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/features/posts/service"
)

type LikesService struct {
	likesRepo    LikesRepository
	postsService service.PostsService
	cacheRepo    Cache
}

type LikesRepository interface {
	AddLike(ctx context.Context, like domain.Like) (int64, error)
	RemoveLike(ctx context.Context, like domain.Like) (int64, error)
	IsLiked(ctx context.Context, userID, postID string) (bool, error)
}

type Cache interface{}

func NewLikesService(likesRepo LikesRepository, postsService service.PostsService, cacheRepo Cache) *LikesService {
	return &LikesService{
		likesRepo:    likesRepo,
		postsService: postsService,
		cacheRepo:    cacheRepo,
	}
}
