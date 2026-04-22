package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	posts_models "github.com/tryingmyb3st/PolyTweet/internal/features/posts/repository"
)

func (r *PostsRepository) GetPostsByUser(
	ctx context.Context,
	userID string,
	offset int,
	limit int,
) ([]domain.Post, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	query := `
	SELECT id, user_id, content, likes_count, parent_id, reply_to, image_url, created_at
	FROM posts
	WHERE user_id = $1
	ORDER BY created_at DESC
	LIMIT $2 OFFSET $3
	`

	var posts []domain.Post

	rows, err := r.ConnPool.Query(ctxTimeout, query, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("scan returning posts: %w", err)
	}

	for rows.Next() {
		var model posts_models.PostModel
		err = rows.Scan(
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
			return nil, fmt.Errorf("scan returning posts: %w", err)
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
		}
		posts = append(posts, post)
	}

	return posts, nil
}
