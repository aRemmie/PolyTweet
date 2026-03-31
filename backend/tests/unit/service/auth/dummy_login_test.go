package auth_service_test

import (
	"os"
	"testing"

	auth_service "github.com/tryingmyb3st/PolyTweet/internal/features/auth/service"
	"github.com/tryingmyb3st/PolyTweet/internal/utils/jwt_utils"
	auth_service_mock "github.com/tryingmyb3st/PolyTweet/mocks/auth_service"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

func TestDummyLoginUser(t *testing.T) {
	m := auth_service_mock.NewMockAuthRepository(t)

	authService := auth_service.NewAuthService(m)

	user := domain.User{
		Role: "user",
	}

	jwtToken, err := authService.GetTestJWTByRole(user)

	require.NoError(t, err)

	claims := jwt_utils.CustomClaims{}

	token, err := jwt.ParseWithClaims(*jwtToken, &claims, func(t *jwt.Token) (any, error) {
		return []byte(os.Getenv("TOKEN_SECRET")), nil
	})

	require.NoError(t, err)
	require.True(t, token.Valid)
	assert.Equal(t, "user", claims.Role)
}

func TestDummyLoginAdmin(t *testing.T) {
	m := auth_service_mock.NewMockAuthRepository(t)

	authService := auth_service.NewAuthService(m)

	user := domain.User{
		Role: "admin",
	}

	jwtToken, err := authService.GetTestJWTByRole(user)

	require.NoError(t, err)

	claims := jwt_utils.CustomClaims{}

	token, err := jwt.ParseWithClaims(*jwtToken, &claims, func(t *jwt.Token) (any, error) {
		return []byte(os.Getenv("TOKEN_SECRET")), nil
	})

	require.NoError(t, err)
	require.True(t, token.Valid)
	assert.Equal(t, "admin", claims.Role)
}

func TestDummyLoginInvalid(t *testing.T) {
	m := auth_service_mock.NewMockAuthRepository(t)

	authService := auth_service.NewAuthService(m)

	user := domain.User{
		Role: "some role...",
	}

	_, err := authService.GetTestJWTByRole(user)

	require.ErrorIs(t, err, domain.INVALID_REQUEST)
}
