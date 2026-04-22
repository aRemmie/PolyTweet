package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	posts_models "github.com/tryingmyb3st/PolyTweet/internal/features/posts/repository"
)

func (r *PostsRepository) GetPostsByUserID(ctx context.Context, userID string) ([]domain.Post, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	query := `
	SELECT id, user_id, content, likes_count, parent_id, reply_to, image_url, created_at
	FROM posts
	WHERE user_id = $1
	ORDER BY created_at DESC
	`

	rows, err := r.ConnPool.Query(ctxTimeout, query, userID)
	if err != nil {
		return nil, fmt.Errorf("query posts by user id: %w", err)
	}
	defer rows.Close()

	var posts []domain.Post
	for rows.Next() {
		var model posts_models.PostModel
		err := rows.Scan(
			&model.ID,
			&model.UserID,
			&model.Content,
			&model.LikesCount,
			&model.ParentID,
			&model.ReplyTo,
			&model.ImageURL,
			&model.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan post: %w", err)
		}

		posts = append(posts, domain.Post{
			ID:         model.ID,
			UserID:     model.UserID,
			Content:    model.Content,
			LikesCount: model.LikesCount,
			ParentID:   model.ParentID,
			ReplyTo:    model.ReplyTo,
			ImageURL:   model.ImageURL,
			CreatedAt:  model.CreatedAt,
		})
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return posts, nil
}
