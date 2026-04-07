package auth_service

import (
	"context"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

type AuthService struct {
	authRepo  AuthRepository
	cacheRepo Cache
}

type AuthRepository interface {
	SaveNewUser(ctx context.Context, user domain.User) (*domain.User, error)
	GetUser(ctx context.Context, email string) (*domain.User, error)
}

type Cache interface {
	GetUser(ctx context.Context, email string) (*domain.User, error)
	SaveUser(user *domain.User) error
}

func NewAuthService(repo AuthRepository, cache Cache) *AuthService {
	return &AuthService{
		authRepo:  repo,
		cacheRepo: cache,
	}
}
