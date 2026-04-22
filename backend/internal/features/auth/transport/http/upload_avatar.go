package auth_transport

import (
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type UploadAvatarResponse struct {
	AvatarURL string `json:"avatar_url" example:"http://localhost:8333/6,0307364665"`
}

// UploadAvatar godoc
// @Summary Загрузить аватарку пользотвалея
// @Description Загрузить аватарку в SeaweedFS и обновить профиль пользователя
// @Tags Profile
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "Файл аватарки"
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} UploadAvatarResponse
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 500 {object}  domain.InternalError "Внутренняя ошибка сервера"
// @Router /profile/avatar [post]
func (h *AuthHTTPHandler) UploadAvatar(w http.ResponseWriter, r *http.Request) {
	log := r.Context().Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	userID := r.Context().Value("userId").(string)

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		log.Debug("failed to parse multipart form", zap.Error(err))
		respWriter.ErrorResponse(domain.INVALID_REQUEST, http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		log.Debug("failed to get file from form", zap.Error(err))
		respWriter.ErrorResponse(domain.INVALID_REQUEST, http.StatusBadRequest)
		return
	}
	defer file.Close()

	contentType := header.Header.Get("Content-Type")
	if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/jpg" && contentType != "image/webp" {
		log.Debug("invalid file type", zap.String("contentType", contentType))
		respWriter.ErrorResponse(domain.INVALID_REQUEST, http.StatusBadRequest)
		return
	}

	avatarURL, err := h.AuthService.UploadAvatar(r.Context(), userID, file, header.Filename)
	if err != nil {
		log.Error("failed to upload avatar", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	resp := UploadAvatarResponse{
		AvatarURL: avatarURL,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
