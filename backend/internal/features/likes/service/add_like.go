package service

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (s *LikesService) AddLike(ctx context.Context, userID, postID string) (int64, error) {
	var like domain.Like

	like.UserID = userID
	like.PostID = postID

	if err := like.Validate(); err != nil {
		return 0, fmt.Errorf("validate like: %w", domain.INVALID_REQUEST)
	}

	_, err := s.postsService.GetPostByID(ctx, like.PostID)
	if err != nil {
		return 0, fmt.Errorf("get post by id error while liking: %w", err)
	}

	likesCount, err := s.likesRepo.AddLike(ctx, like)
	if err != nil {
		return 0, fmt.Errorf("add like: %w", domain.INTERNAL_ERROR)
	}

	return likesCount, nil
}
