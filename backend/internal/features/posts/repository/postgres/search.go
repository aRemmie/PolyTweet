package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/features/posts/repository"
)

func (r *PostsRepository) SearchPosts(ctx context.Context, query string) ([]domain.Post, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	tsQuery := domain.ParseSearchQuery(query)
	if tsQuery == "" {
		offset, limit := 0, domain.DefaultPageSize
		return r.GetLastWeekPosts(ctx, offset, limit)
	}

	sqlQuery := `
	SELECT p.id, p.user_id, p.content, p.likes_count, p.parent_id,
		p.reply_to, p.image_url, p.created_at,
		u.username, COALESCE(u.avatar_url, ''),
		ts_rank(p.search_vector, to_tsquery('russian', $1)) as rank
	FROM posts p
	LEFT JOIN users u ON p.user_id = u.id
	WHERE p.search_vector @@ to_tsquery('russian', $1)
	ORDER BY rank DESC, p.created_at DESC
	`

	rows, err := r.ConnPool.Query(ctxTimeout, sqlQuery, tsQuery)
	if err != nil {
		return nil, fmt.Errorf("search posts: %w", err)
	}

	defer rows.Close()

	var posts []domain.Post
	for rows.Next() {
		var model repository.PostModel
		var rank float64

		err = rows.Scan(
			&model.ID,
			&model.UserID,
			&model.Content,
			&model.LikesCount,
			&model.ParentID,
			&model.ReplyTo,
			&model.ImageURL,
			&model.CreatedAt,
			&model.Username,
			&model.AvatarURL,
			&rank,
		)

		if err != nil {
			return nil, fmt.Errorf("search posts: %w", err)
		}

		post := domain.Post{
			ID:         model.ID,
			UserID:     model.UserID,
			Content:    model.Content,
			LikesCount: model.LikesCount,
			ParentID:   model.ParentID,
			ReplyTo:    model.ReplyTo,
			ImageURL:   model.ImageURL,
			CreatedAt:  model.CreatedAt,
			Username:   model.Username,
			AvatarURL:  model.AvatarURL,
		}
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("search posts: %w", err)
	}

	return posts, nil
}
