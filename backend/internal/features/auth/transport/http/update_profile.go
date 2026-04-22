package auth_transport

import (
	"encoding/json"
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type UpdateProfileRequest struct {
	AvatarURL string `json:"avatar_url" example:"http://localhost:8333/6,0307364665" extensions:"x-order=0"`
	Bio       string `json:"bio" example:"lol" extensions:"x-order=0"`
}

type UpdateProfileResp struct {
	Message string `json:"message"`
}

// UpdateUserProfile godoc
// @Summary Обновить профиль пользователя
// @Description Обновить профиль пользователя (аватарка и о себе)
// @Tags Profile
// @Accept json
// @Produce json
// @Param request body UpdateProfileRequest true "Информация профиля"
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} UpdateProfileResp "Успешный запрос"
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 500 {object}  domain.InternalError "Внутренняя ошибка сервера"
// @Router /profile/update [put]
func (h *AuthHTTPHandler) UpdateUserProfile(w http.ResponseWriter, r *http.Request) {
	log := r.Context().Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	userID := r.Context().Value("userId").(string)

	var req UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Debug("failed to decode request", zap.Error(err))
		respWriter.ErrorResponse(domain.INVALID_REQUEST, http.StatusBadRequest)
		return
	}

	if err := h.AuthService.UpdateUserProfile(r.Context(), userID, req.AvatarURL, req.Bio); err != nil {
		log.Error("failed to update profile", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	respWriter.JSONResponse(UpdateProfileResp{"profile updated successfully"}, http.StatusOK)
}
