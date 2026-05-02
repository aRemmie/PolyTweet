package http

import (
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"github.com/tryingmyb3st/PolyTweet/internal/utils/jwt_utils"
	"go.uber.org/zap"

	_ "github.com/tryingmyb3st/PolyTweet/internal/core/domain"
)

// GetPostsByFollow godoc
// @Summary Посты пользователей, на которых подписан авторизаванный юзер
// @Description Посты пользователей, на которых подписан авторизаванный юзер
// @Tags Posts
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} GetPostsByUserDTOResponse "Посты найдены"
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 401 {object} domain.CustomError "Неверные учетные данные"
// @Failure 500 {object} domain.InternalError "Внутренняя ошибка сервера"
// @Router /posts/follow [get]
func (h *PostsHTTPHandler) GetPostsByFollow(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	log := ctx.Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	claims, _ := jwt_utils.VerifyJWTtoken(r.Header.Get("Authorization")[7:])
	userID := claims.UserId

	posts, err := h.PostsService.GetPostsByFollow(ctx, userID)

	if err != nil {
		log.Error("get posts by user", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	resp := GetPostsByUserDTOResponse{
		Posts: posts,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
