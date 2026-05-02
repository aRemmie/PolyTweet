package auth_service

import (
	"context"
	"fmt"
)

func (s *AuthService) FollowUser(ctx context.Context, userToFollow, userID string) error {
	if err := s.authRepo.AddFollowerToUser(ctx, userToFollow, userID); err != nil {
		return fmt.Errorf("follow user: %w", err)
	}

	return nil
}
