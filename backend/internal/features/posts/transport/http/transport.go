package http

import (
	"context"
	"mime/multipart"
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
	GetLastWeekPosts(
		ctx context.Context,
		paginationParams *domain.PaginationParams,
	) ([]domain.Post, *domain.Pagination, error)
	UploadImage(ctx context.Context, file multipart.File, filename string) (string, error)
	SearchPosts(ctx context.Context, search domain.Search) ([]domain.Post, error)
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
			URL:                  "/users/{UserId}/posts",
			Handler:              h.GetPostsByUser,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               http.MethodDelete,
			URL:                  "/posts/{PostId}/delete",
			Handler:              h.DeletePost,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               http.MethodGet,
			URL:                  "/posts/all",
			Handler:              h.GetLastWeekPosts,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               http.MethodPost,
			URL:                  "/posts/image",
			Handler:              h.UploadPostImage,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               http.MethodGet,
			URL:                  "/posts/search",
			Handler:              h.SearchPosts,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
	}
}
