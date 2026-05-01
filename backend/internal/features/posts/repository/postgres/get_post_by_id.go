package postgres

import (
	"context"
	"fmt"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	posts_models "github.com/tryingmyb3st/PolyTweet/internal/features/posts/repository"
)

func (r *PostsRepository) GetPostByID(ctx context.Context, postID string) (*domain.Post, error) {
	ctxTimeout, cancel := context.WithTimeout(ctx, r.ConnPool.OpTimeout())
	defer cancel()

	query := `
	SELECT p.id, p.user_id, p.content, p.likes_count,
	        p.parent_id, p.reply_to, p.image_url, p.created_at,
	        u.username, COALESCE(u.avatar_url, '')
	FROM posts p
	LEFT JOIN users u ON p.user_id = u.id
	WHERE p.id = $1;
	`

	row := r.ConnPool.QueryRow(ctxTimeout, query, postID)

	var model posts_models.PostModel
	err := row.Scan(
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
		return nil, fmt.Errorf("scan returning post: %w", err)
	}

	return &domain.Post{
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
	}, nil
}
