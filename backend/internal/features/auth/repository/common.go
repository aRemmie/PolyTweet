package auth_models

import (
	"database/sql"
	"time"
)

type UserModel struct {
	ID         string         `redis:"id"`
	Username   string         `redis:"username"`
	Email      string         `redis:"email"`
	Password   string         `redis:"password"`
	Role       string         `redis:"role"`
	AvatarURL  sql.NullString `redis:"avatar_url"`
	Bio        sql.NullString `redis:"bio"`
	Follows    []string       `redis:"follows"`
	FollowedBy []string       `redis:"followed_by"`
	CreatedAt  time.Time      `redis:"createdAt"`
}
