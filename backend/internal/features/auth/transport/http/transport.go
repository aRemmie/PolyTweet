package auth_transport

import (
	"context"
	"mime/multipart"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/middleware"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/server"
)

type AuthHTTPHandler struct {
	AuthService AuthService
}

type AuthService interface {
	GetTestJWTByRole(user domain.User) (*string, error)
	RegisterUser(ctx context.Context, user domain.User, password string) (*domain.User, error)
	LoginUser(ctx context.Context, email, password string) (*string, error)
	GetUserProfile(ctx context.Context, userID string) (*domain.User, error)
	GetUserProfileWithPosts(ctx context.Context, userID string) (*domain.User, []domain.Post, error)
	UpdateUserProfile(ctx context.Context, userID, avatarURL, bio string) error
	UploadAvatar(ctx context.Context, userID string, file multipart.File, filename string) (string, error)
}

func NewAuthHandler(authServ AuthService) *AuthHTTPHandler {
	return &AuthHTTPHandler{
		AuthService: authServ,
	}
}

func (h *AuthHTTPHandler) Routes() []server.Route {
	return []server.Route{
		{
			Method:  "POST",
			URL:     "/dummyLogin",
			Handler: h.GetDummyLogin,
		},
		{
			Method:  "POST",
			URL:     "/register",
			Handler: h.RegisterUser,
		},
		{
			Method:  "POST",
			URL:     "/login",
			Handler: h.LoginUser,
		},
		{
			Method:               "GET",
			URL:                  "/users/{UserId}/profile",
			Handler:              h.GetUserProfile,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               "PUT",
			URL:                  "/profile/update",
			Handler:              h.UpdateUserProfile,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               "POST",
			URL:                  "/profile/avatar",
			Handler:              h.UploadAvatar,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
	}
}
