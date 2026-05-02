package auth_transport

import (
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"github.com/tryingmyb3st/PolyTweet/internal/utils/jwt_utils"
	"go.uber.org/zap"
)

// UpdateUserProfile godoc
// @Summary Отписаться от пользователя
// @Description Отписаться авторизованным пользователем от другого пользователя по UserId
// @Tags Profile
// @Accept json
// @Produce json
// @Param UserId path string true "User ID"
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} FollowResponse "Успешный запрос"
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 500 {object}  domain.InternalError "Внутренняя ошибка сервера"
// @Router /users/{UserId}/unfollow [post]
func (h *AuthHTTPHandler) UnfollowUserByUserID(w http.ResponseWriter, r *http.Request) {
	log := r.Context().Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	userToFollow := r.PathValue("UserId")
	if userToFollow == "" {
		log.Debug("user id is empty")
		respWriter.ErrorResponse(domain.INVALID_REQUEST, http.StatusBadRequest)
		return
	}

	claims, _ := jwt_utils.VerifyJWTtoken(r.Header.Get("Authorization")[7:])
	userID := claims.UserId

	if userID == userToFollow {
		respWriter.MapError(domain.INVALID_REQUEST)
		return
	}

	err := h.AuthService.UnfollowUser(r.Context(), userToFollow, userID)
	if err != nil {
		log.Error("failed to follow user", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	respWriter.JSONResponse(FollowResponse{Message: "success"}, http.StatusOK)
}
