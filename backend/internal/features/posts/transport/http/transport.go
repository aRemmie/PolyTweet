package http

import (
	"context"
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/middleware"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/server"
)

type PostsHTTPHandler struct {
	PostsService PostsService
}

type PostsService interface {
	CreatePost(ctx context.Context, post domain.Post) (*domain.Post, error)
	GetPostByID(ctx context.Context, postID string) (*domain.Post, error)
	GetPostsByUser(
		ctx context.Context, userID string,
		page string,
		pageSize string,
	) ([]domain.Post, *domain.Pagination, error)
	DeletePost(ctx context.Context, userID, postID string) error
}

func NewPostsHandler(postsService PostsService) *PostsHTTPHandler {
	return &PostsHTTPHandler{
		PostsService: postsService,
	}
}

func (h *PostsHTTPHandler) Routes() []server.Route {
	return []server.Route{
		{
			Method:               http.MethodPost,
			URL:                  "/posts/create",
			Handler:              h.CreatePost,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               http.MethodGet,
			URL:                  "/posts/{PostId}",
			Handler:              h.GetPostById,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               http.MethodGet,
			URL:                  "/posts/users/{UserId}",
			Handler:              h.GetPostsByUser,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               http.MethodDelete,
			URL:                  "/posts/{PostId}/delete",
			Handler:              h.DeletePost,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
	}
}
