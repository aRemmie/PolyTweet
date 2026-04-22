package auth_service

import (
	"context"
	"mime/multipart"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

type AuthService struct {
	authRepo      AuthRepository
	cacheRepo     Cache
	postsRepo     PostsRepository
	storageClient StorageClient
}

type AuthRepository interface {
	SaveNewUser(ctx context.Context, user domain.User) (*domain.User, error)
	GetUser(ctx context.Context, email string) (*domain.User, error)
	GetUserByID(ctx context.Context, userID string) (*domain.User, error)
	UpdateUserProfile(ctx context.Context, userID, avatarURL, bio string) error
}

type Cache interface {
	GetUser(ctx context.Context, email string) (*domain.User, error)
	GetUserByID(ctx context.Context, userID string) (*domain.User, error)
	SaveUser(user *domain.User) error
}

type PostsRepository interface {
	GetPostsByUserID(ctx context.Context, userID string) ([]domain.Post, error)
}

type StorageClient interface {
	UploadFile(file multipart.File, filename string) (string, error)
}

func NewAuthService(repo AuthRepository, cache Cache, postsRepo PostsRepository, storageClient StorageClient) *AuthService {
	return &AuthService{
		authRepo:      repo,
		cacheRepo:     cache,
		postsRepo:     postsRepo,
		storageClient: storageClient,
	}
}
