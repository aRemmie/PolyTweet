package repository

import "time"

type LikeModel struct {
	UserID    string    `redis:"user_id"`
	PostID    string    `redis:"post_id"`
	CreatedAt time.Time `redis:"created_at"`
}
