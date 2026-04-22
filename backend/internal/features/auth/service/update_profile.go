package auth_service

import (
	"context"
	"fmt"
)

func (s *AuthService) UpdateUserProfile(ctx context.Context, userID, avatarURL, bio string) error {
	if err := s.authRepo.UpdateUserProfile(ctx, userID, avatarURL, bio); err != nil {
		return fmt.Errorf("update user profile: %w", err)
	}

	user, err := s.authRepo.GetUserByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("get updated user: %w", err)
	}

	if err := s.cacheRepo.SaveUser(user); err != nil {
		return fmt.Errorf("update cache: %w", err)
	}

	return nil
}
