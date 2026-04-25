package transport

import (
	"net/http"

	_ "github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type LikeStatusResponseDTO struct {
	IsLiked bool `json:"is_liked"`
}

// GetLikeStatus godoc
// @Summary Проверить статус лайка
// @Description Проверяет, лайкнут ли пост текущим пользователем
// @Tags Likes
// @Produce json
// @Param PostId path string true "Post ID (UUID)"
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} LikeStatusResponseDTO
// @Failure 401 {object} domain.CustomError
// @Failure 500 {object} domain.InternalError
// @Router /posts/{PostId}/like/status [get]
func (h *LikesHTTPHandler) GetLikeStatus(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	log := ctx.Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	userID := ctx.Value("userId").(string)
	postID := r.PathValue("PostId")

	isLiked, err := h.LikesService.IsLiked(ctx, userID, postID)
	if err != nil {
		log.Error("failed to check like status", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	resp := LikeStatusResponseDTO{
		IsLiked: isLiked,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
