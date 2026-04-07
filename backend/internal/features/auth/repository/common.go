package auth_models

import (
	"time"
)

type UserModel struct {
	ID        string    `redis:"id"`
	Email     string    `redis:"email"`
	Password  string    `redis:"password"`
	Role      string    `redis:"role"`
	CreatedAt time.Time `redis:"createdAt"`
}
