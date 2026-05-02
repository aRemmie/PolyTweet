package auth_transport

import (
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

// GetUserProfileByJWT godoc
// @Summary Получить профиль пользователя по JWT
// @Description Получить профиль пользователя с постами по JWT
// @Tags Profile
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} ProfileResponse
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 500 {object}  domain.InternalError "Внутренняя ошибка сервера"
// @Router /users/me/profile [get]
func (h *AuthHTTPHandler) GetUserProfileByJWT(w http.ResponseWriter, r *http.Request) {
	log := r.Context().Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	userID := r.Context().Value("userId").(string)
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
			Username:  user.Username,
			Content:   post.Content,
			UserID:    post.UserID,
			CreatedAt: post.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
			AvatarURL: user.AvatarURL,
		})
	}

	profileResp := ProfileResponse{
		ID:         user.ID,
		Username:   user.Username,
		Email:      user.Email,
		Role:       user.Role,
		AvatarURL:  user.AvatarURL,
		Bio:        user.Bio,
		Follows:    user.Follows,
		FollowedBy: user.FollowedBy,
		CreatedAt:  user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		Posts:      postResponses,
	}

	respWriter.JSONResponse(profileResp, http.StatusOK)
}
