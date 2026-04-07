package auth_service

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	hash_utils "github.com/tryingmyb3st/PolyTweet/internal/utils/hash"
	"github.com/tryingmyb3st/PolyTweet/internal/utils/jwt_utils"
)

func (s *AuthService) LoginUser(ctx context.Context, email, password string) (*string, error) {
	var user *domain.User

	user, err := s.cacheRepo.GetUser(ctx, email)
	if err != nil {

		user, err = s.authRepo.GetUser(ctx, email)

		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return nil, fmt.Errorf("no user: %w", domain.UNAUTHORIZED)
			}

			return nil, fmt.Errorf("get from database: %w", domain.INTERNAL_ERROR)
		}

		go func() {
			if err := s.cacheRepo.SaveUser(user); err != nil {
				log.Println("err save to cache: %w", err)
			}
		}()
	}

	if !hash_utils.CheckPasswordHash(password, user.Password) {
		return nil, fmt.Errorf("wrong password: %w", domain.UNAUTHORIZED)
	}

	jwt, err := jwt_utils.GenerateJWT(user.ID, user.Role)
	if err != nil {
		return nil, fmt.Errorf("generating jwt: %w", domain.INTERNAL_ERROR)
	}

	return jwt, nil
}
