package transport

import (
	"context"
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/middleware"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/server"
)

type LikesHTTPHandler struct {
	LikesService LikesService
}

type LikesService interface {
	AddLike(ctx context.Context, userID, postID string) (int64, error)
	RemoveLike(ctx context.Context, userID, postID string) (int64, error)
	IsLiked(ctx context.Context, userID, postID string) (bool, error)
}

func NewLikesHandler(likesService LikesService) *LikesHTTPHandler {
	return &LikesHTTPHandler{
		LikesService: likesService,
	}
}

func (h *LikesHTTPHandler) Routes() []server.Route {
	return []server.Route{
		{
			Method:               http.MethodPost,
			URL:                  "/posts/{PostId}/like",
			Handler:              h.LikePost,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               http.MethodDelete,
			URL:                  "/posts/{PostId}/like",
			Handler:              h.RemoveLike,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()},
		},
		{
			Method:               http.MethodGet,
			URL:                  "/posts/{PostId}/like/status",
			Handler:              h.GetLikeStatus,
			AdditionalMiddleware: []middleware.Middleware{middleware.AuthMiddleware()}},
	}
}
