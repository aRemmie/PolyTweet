package http

import (
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type GetPostsByUserDTO struct {
	UserID string `json:"user_id"`
}

type GetPostsByUserDTOResponse struct {
	Posts      []domain.Post      `json:"posts"`
	Pagination *domain.Pagination `json:"pagination"`
}

// GetPostsByUser godoc
// @Summary Поиск постов пользователя
// @Description Ищет посты пользователя по ID с поддержкой пагинации через параметры page и pageSize.
// @Tags Posts
// @Accept json
// @Produce json
// @Param UserId path string true "User ID (UUID)" Format(uuid) Example(3fa85f64-5717-4562-b3fc-2c963f66afa6)
// @Param page query int false "Номер страницы"  minimum(1)  default(1)
// @Param page_size query int false "Размер страницы"  minimum(1)  maximum(30)  default(15)
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} GetPostByIdDTOResponse "Посты найдены"
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 401 {object} domain.CustomError "Неверные учетные данные"
// @Failure 500 {object} domain.InternalError "Внутренняя ошибка сервера"
// @Router /users/{UserId}/posts [get]
func (h *PostsHTTPHandler) GetPostsByUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("page_size")

	log := ctx.Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	userID := r.PathValue("UserId")
	log.Debug("getting posts for user", zap.String("userId", userID))

	posts, pagination, err := h.PostsService.GetPostsByUser(ctx, userID, pageStr, pageSizeStr)

	if err != nil {
		log.Error("get posts by user", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	resp := GetPostsByUserDTOResponse{
		Posts:      posts,
		Pagination: pagination,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
