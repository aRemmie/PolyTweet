package service

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (s *LikesService) RemoveLike(ctx context.Context, userID, postID string) error {
	var like domain.Like

	like.UserID = userID
	like.PostID = postID

	if err := like.Validate(); err != nil {
		return fmt.Errorf("validate like: %w", domain.INVALID_REQUEST)
	}

	_, err := s.postsService.GetPostByID(ctx, like.PostID)
	if err != nil {
		return fmt.Errorf("get post by id error while unliking: %w", err)
	}

	err = s.likesRepo.RemoveLike(ctx, like)
	if err != nil {
		return fmt.Errorf("remove like: %w", domain.INTERNAL_ERROR)
	}

	return nil
}
