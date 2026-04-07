package http

import (
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type GetLastWeekPostsDTOResponse struct {
	Posts      []domain.Post      `json:"posts"`
	Pagination *domain.Pagination `json:"pagination"`
}

// GetLastWeekPosts godoc
// @Summary Поиск постов за последние 7 дней
// @Description Ищет посты за последние 7 дней с поддержкой пагинации через параметры page и pageSize.
// @Tags Posts
// @Accept json
// @Produce json
// @Param page query int false "Номер страницы"  minimum(1)  default(1)
// @Param page_size query int false "Размер страницы"  minimum(1)  maximum(30)  default(15)
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} GetLastWeekPostsDTOResponse "Посты найдены"
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 401 {object} domain.CustomError "Неверные учетные данные"
// @Failure 500 {object} domain.InternalError "Внутренняя ошибка сервера"
// @Router /posts/all [get]
func (h *PostsHTTPHandler) GetLastWeekPosts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	log := ctx.Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("page_size")

	paginationParams, err := domain.ParsePaginationParams(pageStr, pageSizeStr)
	if err != nil {
		log.Error("get last week posts", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	posts, pagination, err := h.PostsService.GetLastWeekPosts(ctx, paginationParams)

	if err != nil {
		log.Error("get last week posts", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	resp := GetLastWeekPostsDTOResponse{
		Posts:      posts,
		Pagination: pagination,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
