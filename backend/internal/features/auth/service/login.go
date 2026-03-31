package auth_service

import (
	"context"
	"errors"
	"fmt"

	"github.com/redis/go-redis/v9"
	"github.com/tryingmyb3st/PolyTweet/internal/utils/jwt_utils"

	"github.com/jackc/pgx/v5"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	hash_utils "github.com/tryingmyb3st/PolyTweet/internal/utils/hash"
)

func (s *AuthService) LoginUser(ctx context.Context, email, password string) (*string, error) {
	var user *domain.User

	user, err := s.cacheRepo.GetUser(ctx, email)
	if err != nil {
		if !errors.Is(err, redis.Nil) {
			return nil, fmt.Errorf("get from cache: %w", err)
		}

		user, err = s.authRepo.GetUser(ctx, email)
		fmt.Println("from database")

		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return nil, fmt.Errorf("no user: %w", domain.UNAUTHORIZED)
			}

			return nil, fmt.Errorf("get from database: %w", domain.INTERNAL_ERROR)
		}

		if err := s.cacheRepo.SaveUser(ctx, *user); err != nil {
			fmt.Println(err)
			return nil, fmt.Errorf("%s: %w", err, domain.INTERNAL_ERROR)
		}
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
