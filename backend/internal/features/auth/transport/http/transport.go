package auth_transport

import (
	"context"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"

	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/server"
)

type AuthHTTPHandler struct {
	AuthService AuthService
}

type AuthService interface {
	GetTestJWTByRole(user domain.User) (*string, error)
	RegisterUser(ctx context.Context, user domain.User, password string) (*domain.User, error)
	LoginUser(ctx context.Context, email, password string) (*string, error)
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
	}
}
