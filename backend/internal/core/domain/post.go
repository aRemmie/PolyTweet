package domain

import (
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"
)

type Post struct {
	ID         string    `json:"id" validate:"required,uuid"`
	UserID     string    `json:"user_id" validate:"required,uuid"`
	Content    string    `json:"content" validate:"required,min=1,max=280"`
	LikesCount int       `json:"likes_count"`
	ParentID   *string   `json:"parent_id" validate:"omitempty,uuid"`
	ReplyTo    *string   `json:"reply_to" validate:"omitempty,uuid"`
	ImageURL   string    `json:"image_url" validate:"omitempty,url"`
	CreatedAt  time.Time `json:"created_at"`
}

func (p *Post) Validate() error {
	validator := validator.New()

	if err := validator.Struct(p); err != nil {
		return fmt.Errorf("validator struct: %w", err)
	}

	return nil
}
