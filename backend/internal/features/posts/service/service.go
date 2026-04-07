package service

import (
	"context"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

type PostsService struct {
	postsRepo PostsRepository
	cacheRepo Cache
}

type PostsRepository interface {
	CreatePost(ctx context.Context, post domain.Post) (*domain.Post, error)
	GetPostByID(ctx context.Context, postID string) (*domain.Post, error)
	GetPostsByUser(ctx context.Context, userID string, offset int, limit int) ([]domain.Post, error)
	GetCountOfPostsByUser(ctx context.Context, userID string) (int64, error)
	DeletePost(ctx context.Context, userID, postID string) error
	GetLastWeekPosts(ctx context.Context, offset int, limit int) ([]domain.Post, error)
	GetCountOfLastWeekPosts(ctx context.Context) (int64, error)
}

type Cache interface {
	SavePost(post *domain.Post) error
	GetPostByID(ctx context.Context, postID string) (*domain.Post, error)
}

func NewPostsService(postsRepo PostsRepository, cache Cache) *PostsService {
	return &PostsService{
		postsRepo: postsRepo,
		cacheRepo: cache,
	}
}
