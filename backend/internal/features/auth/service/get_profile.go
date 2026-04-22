package auth_service

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (s *AuthService) GetUserProfile(ctx context.Context, userID string) (*domain.User, error) {
	user, err := s.cacheRepo.GetUserByID(ctx, userID)
	if err == nil {
		return user, nil
	}

	user, err = s.authRepo.GetUserByID(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("no user: %w", domain.UNAUTHORIZED)
		}

		return nil, fmt.Errorf("get user by id: %w", err)
	}

	if err := s.cacheRepo.SaveUser(user); err != nil {
		return nil, fmt.Errorf("save user to cache: %w", err)
	}

	return user, nil
}
