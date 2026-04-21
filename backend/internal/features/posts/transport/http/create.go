package http

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type CreatePostDTO struct {
	Content  string  `json:"content" example:"Hello, world!" extensions:"x-order=0"`
	ParentID *string `json:"parent_id" example:"123e4567-e89b-12d3-a456-426614174000" extensions:"x-order=1"`
	ReplyTo  *string `json:"reply_to" example:"123e4567-e89b-12d3-a456-426614174000" extensions:"x-order=2"`
	ImageURL string  `json:"image_url" example:"https://example.com/image.jpg" extensions:"x-order=3"`
}

type CreatePostDTOResponse struct {
	ID         string    `json:"id" example:"3fa85f64-5717-4562-b3fc-2c963f66afa6" extensions:"x-order=0"`
	UserID     string    `json:"user_id" example:"3fa85f64-5717-4562-b3fc-2c963f66afa6" extensions:"x-order=1"`
	Content    string    `json:"content" example:"Hello, world!" extensions:"x-order=2"`
	LikesCount int       `json:"likes_count" example:"0" extensions:"x-order=3"`
	ParentID   *string   `json:"parent_id" example:"123e4567-e89b-12d3-a456-426614174000" extensions:"x-order=4"`
	ReplyTo    *string   `json:"reply_to" example:"123e4567-e89b-12d3-a456-426614174000" extensions:"x-order=5"`
	ImageURL   string    `json:"image_url" example:"https://example.com/image.jpg" extensions:"x-order=6"`
	CreatedAt  time.Time `json:"created_at" example:"2026-03-25T12:00:41.267Z" extensions:"x-order=7"`
}

// CreatePost godoc
// @Summary Создание поста
// @Description Создает пост длиной <= 280 символов
// @Tags Posts
// @Accept json
// @Produce json
// @Param request body CreatePostDTO true "parent_id и reply_to необязательные параметры"
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 201 {object} CreatePostDTOResponse "Пост создан"
// @Failure 400 {object} domain.CustomError "Неверный запрос или content > 280 символов"
// @Failure 401 {object} domain.CustomError "Неверные учетные данные"
// @Failure 500 {object} domain.InternalError "Внутренняя ошибка сервера"
// @Router /posts/create [post]
func (h *PostsHTTPHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	log := ctx.Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	var req CreatePostDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Debug("error decoding create post request", zap.Error(err))
		respWriter.ErrorResponse(domain.INVALID_REQUEST, http.StatusBadRequest)
		return
	}

	userID := ctx.Value("userId").(string)

	post, err := h.PostsService.CreatePost(
		ctx,
		domain.Post{
			UserID:   userID,
			Content:  req.Content,
			ParentID: req.ParentID,
			ReplyTo:  req.ReplyTo,
			ImageURL: req.ImageURL,
		},
	)
	
	if err != nil {
		log.Error("failed to create post", zap.Error(err))
		respWriter.MapError(err)
		return
	}
	resp := CreatePostDTOResponse{
		ID:         post.ID,
		UserID:     post.UserID,
		Content:    post.Content,
		LikesCount: post.LikesCount,
		ParentID:   post.ParentID,
		ReplyTo:    post.ReplyTo,
		ImageURL:   post.ImageURL,
		CreatedAt:  post.CreatedAt,
	}

	respWriter.JSONResponse(resp, http.StatusCreated)
}
