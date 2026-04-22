package auth_transport

import (
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type PostResponse struct {
	ID        string `json:"id" example:"24b6b463-266f-4916-b199-f833e6e334ce" extensions:"x-order=0"`
	Content   string `json:"content" example:"..." extensions:"x-order=1"`
	UserID    string `json:"user_id" example:"bba83b30-a3ba-4fa8-a6de-79c27b3f5946" extensions:"x-order=2"`
	CreatedAt string `json:"created_at" example:"timestamp" extensions:"x-order=3"`
}

type ProfileResponse struct {
	ID        string         `json:"id" example:"http://localhost:8333/6,0307364665" extensions:"x-order=0"`
	Email     string         `json:"email" example:"lol@gmail.com" extensions:"x-order=1"`
	Role      string         `json:"role" example:"admin" extensions:"x-order=2"`
	AvatarURL string         `json:"avatar_url" example:"http://localhost:8333/6,0307364665" extensions:"x-order=3"`
	Bio       string         `json:"bio" example:"lol" extensions:"x-order=4"`
	CreatedAt string         `json:"created_at" example:"timestamp" extensions:"x-order=5"`
	Posts     []PostResponse `json:"posts" extensions:"x-order=6"`
}

// GetUserProfile godoc
// @Summary Получить профиль пользователя
// @Description Получить профиль пользователя с постами по id пользователя
// @Tags Profile
// @Accept json
// @Produce json
// @Param UserId path string true "User ID"
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} ProfileResponse
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 500 {object}  domain.InternalError "Внутренняя ошибка сервера"
// @Router /users/{UserId}/profile [get]
func (h *AuthHTTPHandler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	log := r.Context().Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	userID := r.PathValue("UserId")
	if userID == "" {
		log.Debug("user id is empty")
		respWriter.ErrorResponse(domain.INVALID_REQUEST, http.StatusBadRequest)
		return
	}

	user, posts, err := h.AuthService.GetUserProfileWithPosts(r.Context(), userID)
	if err != nil {
		log.Error("failed to get user profile", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	postResponses := make([]PostResponse, 0, len(posts))
	for _, post := range posts {
		postResponses = append(postResponses, PostResponse{
			ID:        post.ID,
			Content:   post.Content,
			UserID:    post.UserID,
			CreatedAt: post.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}

	profileResp := ProfileResponse{
		ID:        user.ID,
		Email:     user.Email,
		Role:      user.Role,
		AvatarURL: user.AvatarURL,
		Bio:       user.Bio,
		CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		Posts:     postResponses,
	}

	respWriter.JSONResponse(profileResp, http.StatusOK)
}
