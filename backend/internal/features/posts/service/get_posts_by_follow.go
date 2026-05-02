package service

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (s *PostsService) GetPostsByFollow(ctx context.Context, userID string) ([]domain.Post, error) {
	user, err := s.postsRepo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("err %s: %w", err, domain.INVALID_REQUEST)
	}

	result := make([]domain.Post, 0)

	for _, followedUser := range user.Follows {
		posts, _, err := s.GetPostsByUser(ctx, followedUser, "1", "10000")
		if err != nil {
			return nil, fmt.Errorf("err getting posts: %w", err)
		}

		result = append(result, posts...)
	}

	return result, nil
}
