package auth_service

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (s *AuthService) GetUserProfileWithPosts(ctx context.Context, userID string) (*domain.User, []domain.Post, error) {
	user, err := s.cacheRepo.GetUserByID(ctx, userID)
	if err == nil {
		posts, err := s.postsRepo.GetPostsByUserID(ctx, userID)
		if err != nil {
			return nil, nil, fmt.Errorf("get user posts: %w", err)
		}
		return user, posts, nil
	}

	user, err = s.authRepo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("get user by id: %w", err)
	}

	if err := s.cacheRepo.SaveUser(user); err != nil {
		return nil, nil, fmt.Errorf("save user to cache: %w", err)
	}

	posts, err := s.postsRepo.GetPostsByUserID(ctx, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("get user posts: %w", err)
	}

	return user, posts, nil
}
