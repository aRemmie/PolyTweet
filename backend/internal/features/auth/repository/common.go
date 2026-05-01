package auth_models

import (
	"database/sql"
	"time"
)

type UserModel struct {
	ID        string         `redis:"id"`
	Username  string         `redis:"username"`
	Email     string         `redis:"email"`
	Password  string         `redis:"password"`
	Role      string         `redis:"role"`
	AvatarURL sql.NullString `redis:"avatar_url"`
	Bio       sql.NullString `redis:"bio"`
	CreatedAt time.Time      `redis:"createdAt"`
}
