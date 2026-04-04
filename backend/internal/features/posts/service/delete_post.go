package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (s *PostsService) DeletePost(ctx context.Context, userID, postID string) error {
	if _, err := uuid.Parse(userID); err != nil {
		return fmt.Errorf("user id is not uuid: %w", domain.INVALID_REQUEST)
	}

	if _, err := uuid.Parse(postID); err != nil {
		return fmt.Errorf("post id is not uuid: %w", domain.INVALID_REQUEST)
	}

	err := s.postsRepo.DeletePost(ctx, userID, postID)
	if err != nil {
		if errors.Is(err, domain.NOT_FOUND) {
			return fmt.Errorf("post not found: %w", domain.NOT_FOUND)
		}
		return fmt.Errorf("post delete: %w", domain.INTERNAL_ERROR)
	}
	
	return nil
}
