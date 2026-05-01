package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func (s *PostsService) SearchPosts(
	ctx context.Context,
	search domain.Search,
) ([]domain.Post, error) {
	if err := search.Validate(); err != nil {
		return nil, fmt.Errorf("invalid search data: %w", domain.INVALID_REQUEST)
	}

	posts, err := s.postsRepo.SearchPosts(ctx, search.Query)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []domain.Post{}, nil
		}
		return nil, fmt.Errorf("%s: %w", err, domain.INTERNAL_ERROR)
	}

	return posts, nil
}
