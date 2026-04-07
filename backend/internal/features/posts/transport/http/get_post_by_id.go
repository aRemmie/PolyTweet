package http

import (
	"net/http"
	"time"

	_ "github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type GetPostByIdDTO struct {
	PostId string `json:"id"`
}

type GetPostByIdDTOResponse struct {
	ID        string    `json:"id" example:"3fa85f64-5717-4562-b3fc-2c963f66afa6" extensions:"x-order=0"`
	UserID    string    `json:"user_id" example:"3fa85f64-5717-4562-b3fc-2c963f66afa6" extensions:"x-order=1"`
	Content   string    `json:"content" example:"Hello, world!" extensions:"x-order=2"`
	ParentID  *string   `json:"parent_id" example:"123e4567-e89b-12d3-a456-426614174000" extensions:"x-order=3"`
	ReplyTo   *string   `json:"reply_to" example:"123e4567-e89b-12d3-a456-426614174000" extensions:"x-order=4"`
	ImageURL  string    `json:"image_url" example:"https://example.com/image.jpg" extensions:"x-order=5"`
	CreatedAt time.Time `json:"created_at" example:"2026-03-25T12:00:41.267Z" extensions:"x-order=6"`
}

// GetPostById godoc
// @Summary Поиск поста по ID
// @Description Ищет пост по ID
// @Tags Posts
// @Accept json
// @Produce json
// @Param PostId path string true "Post ID (UUID)" Format(uuid) Example(3fa85f64-5717-4562-b3fc-2c963f66afa6)
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} GetPostByIdDTOResponse "Пост найден"
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 401 {object} domain.CustomError "Неверные учетные данные"
// @Failure 404 {object} domain.CustomError "Пост не найден"
// @Failure 500 {object} domain.InternalError "Внутренняя ошибка сервера"
// @Router /posts/{PostId} [get]
func (h *PostsHTTPHandler) GetPostById(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	log := ctx.Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	postID := r.PathValue("PostId")
	log.Debug("getting post with id", zap.String("userId", postID))

	post, err := h.PostsService.GetPostByID(ctx, postID)

	if err != nil {
		log.Error("get post by id", zap.Error(err))

		respWriter.MapError(err)
		return
	}

	resp := GetPostByIdDTOResponse{
		ID:        post.ID,
		UserID:    post.UserID,
		Content:   post.Content,
		ParentID:  post.ParentID,
		ReplyTo:   post.ReplyTo,
		ImageURL:  post.ImageURL,
		CreatedAt: post.CreatedAt,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
