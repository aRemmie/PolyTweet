package service

import (
	"context"
	"fmt"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (s *PostsService) CreatePost(ctx context.Context, post domain.Post) (*domain.Post, error) {
	if err := post.Validate(); err != nil {
		return nil, fmt.Errorf("validate post: %w", domain.INVALID_REQUEST)
	}

	if post.Content == "" {
		return nil, fmt.Errorf("post content is empty: %w", domain.INVALID_REQUEST)
	}

	if utf8.RuneCountInString(post.Content) > 280 {
		return nil, fmt.Errorf("post content is too long: %w", domain.INVALID_REQUEST)
	}

	post.ID = uuid.NewString()
	createdPost, err := s.postsRepo.CreatePost(ctx, post)
	if err != nil {
		return nil, fmt.Errorf("create post: %w", domain.INTERNAL_ERROR)
	}

	return createdPost, nil
}
