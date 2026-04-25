package transport

import (
	"net/http"

	_ "github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type LikePostDTOResponse struct {
	Message    string `json:"message"`
	UserID     string `json:"user_id"`
	PostID     string `json:"post_id"`
	LikesCount int64  `json:"likes_count"`
}

// LikePost godoc
// @Summary Лайк на пост
// @Description Добавляет лайк на пост
// @Tags Likes
// @Accept json
// @Produce json
// @Param PostId path string true "Post ID (UUID)" Format(uuid) Example(3fa85f64-5717-4562-b3fc-2c963f66afa6)
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 201 {object} LikePostDTOResponse "Лайк добавлен"
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 401 {object} domain.CustomError "Неверные учетные данные"
// @Failure 404 {object} domain.CustomError "Такой пост не был найден"
// @Failure 500 {object} domain.InternalError "Внутренняя ошибка сервера"
// @Router /posts/{PostId}/like [post]
func (h *LikesHTTPHandler) LikePost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	log := ctx.Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	userID := ctx.Value("userId").(string)
	log.Debug("like post request for user", zap.String("user_id", userID))

	postID := r.PathValue("PostId")

	likesCount, err := h.LikesService.AddLike(ctx, userID, postID)
	if err != nil {
		log.Error("failed to like post", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	resp := LikePostDTOResponse{
		Message:    "post liked successfully",
		UserID:     userID,
		PostID:     postID,
		LikesCount: likesCount,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
