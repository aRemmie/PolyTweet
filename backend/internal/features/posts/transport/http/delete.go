package http

import (
	"net/http"

	_ "github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type DeletePostDTOResponse struct {
	Message string `json:"message"`
	PostID  string `json:"post_id"`
}

// DeletePost godoc
// @Summary Удаление поста
// @Description Удаляет пост, если запрос на удаление исходит от автора поста
// @Tags Posts
// @Accept json
// @Produce json
// @Param PostId path string true "Post ID (UUID)" Format(uuid) Example(3fa85f64-5717-4562-b3fc-2c963f66afa6)
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} DeletePostDTOResponse "Пост успешно удален"
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 401 {object} domain.CustomError "Неверные учетные данные"
// @Failure 404 {object} domain.CustomError "Пост не найден"
// @Failure 500 {object} domain.InternalError "Внутренняя ошибка сервера"
// @Router /posts/{PostId}/delete [delete]
func (h *PostsHTTPHandler) DeletePost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	log := ctx.Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	userID := ctx.Value("userId").(string)
	log.Debug("delete post request for user", zap.String("userId", userID))

	postID := r.PathValue("PostId")

	err := h.PostsService.DeletePost(ctx, userID, postID)
	if err != nil {
		log.Error("failed to delete post", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	resp := DeletePostDTOResponse{
		Message: "post was successfully deleted",
		PostID:  postID,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
