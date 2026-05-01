package http

import (
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type SearchPostsDTOResponse struct {
	Posts []domain.Post `json:"posts"`
}

// SearchPosts godoc
// @Summary Поиск постов по словам
// @Description Ищет посты по словам, переданным в query
// @Tags Posts
// @Accept json
// @Produce json
// @Param query query string true "Ключевые слова"  minLength(1)  maxLength(100)
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} SearchPostsDTOResponse "Посты найдены"
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 401 {object} domain.CustomError "Неверные учетные данные"
// @Failure 500 {object} domain.InternalError "Внутренняя ошибка сервера"
// @Router /posts/search [get]
func (h *PostsHTTPHandler) SearchPosts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	log := ctx.Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	searchParams := domain.Search{
		Query: r.URL.Query().Get("query"),
	}

	posts, err := h.PostsService.SearchPosts(ctx, searchParams)

	if err != nil {
		log.Error("search posts", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	resp := SearchPostsDTOResponse{
		Posts: posts,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
