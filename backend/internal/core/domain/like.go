package domain

import (
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"
)

type Like struct {
	UserID    string    `json:"user_id" validate:"required,uuid"`
	PostID    string    `json:"post_id" validate:"required,uuid"`
	CreatedAt time.Time `json:"created_at"`
}

func (l *Like) Validate() error {
	validator := validator.New()

	if err := validator.Struct(l); err != nil {
		return fmt.Errorf("validator struct: %w", err)
	}

	return nil
}
