package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	posts_models "github.com/tryingmyb3st/PolyTweet/internal/features/posts/repository"
)

func (r *PostsRepository) GetLastWeekPosts(ctx context.Context, offset int, limit int) ([]domain.Post, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	query := `
	SELECT p.id, p.user_id, p.content, p.likes_count,
	        p.parent_id, p.reply_to, p.image_url, p.created_at,
	        u.username, COALESCE(u.avatar_url, '')
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.created_at > current_timestamp - interval '1 week'
	ORDER BY p.created_at DESC
	LIMIT $1 OFFSET $2;
	`

	var posts []domain.Post

	rows, err := r.ConnPool.Query(ctxTimeout, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("get last week posts: %w", err)
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
			&model.Username,
			&model.AvatarURL,
		)
		if err != nil {
			return nil, fmt.Errorf("get recent posts: %w", err)
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

	return posts, nil
}
