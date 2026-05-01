package service

import (
	"context"
	"mime/multipart"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

type PostsService struct {
	postsRepo     PostsRepository
	cacheRepo     Cache
	storageClient StorageClient
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

type StorageClient interface {
	UploadFile(file multipart.File, filename string) (string, error)
}

func NewPostsService(postsRepo PostsRepository, cache Cache, storageClient StorageClient) *PostsService {
	return &PostsService{
		postsRepo:     postsRepo,
		cacheRepo:     cache,
		storageClient: storageClient,
	}
}
