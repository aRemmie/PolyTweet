package http

import (
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"
	"go.uber.org/zap"
)

type UploadImageDTOResponse struct {
	ImageURL string `json:"image_url" example:"https://example.com/image.jpg"`
}

// UploadPostImage godoc
// @Summary Загрузить изображение для поста
// @Description Загрузить изображение в SeaweedFS и возвращает URL
// @Tags Posts
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "Файл изображения"
// @Param Authorization header string true "Bearer <jwt токен>"
// @Success 200 {object} UploadImageDTOResponse
// @Failure 400 {object} domain.CustomError "Неверный запрос"
// @Failure 500 {object}  domain.InternalError "Внутренняя ошибка сервера"
// @Router /posts/image [post]
func (h *PostsHTTPHandler) UploadPostImage(w http.ResponseWriter, r *http.Request) {
	log := r.Context().Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	const maxFileSize = 5 << 20
	if err := r.ParseMultipartForm(maxFileSize); err != nil {
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
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/jpg":  true,
		"image/png":  true,
	}

	if !allowedTypes[contentType] {
		log.Debug("invalid file type", zap.String("contentType", contentType))
		respWriter.ErrorResponse(domain.INVALID_REQUEST, http.StatusBadRequest)
		return
	}

	imageURL, err := h.PostsService.UploadImage(r.Context(), file, header.Filename)
	if err != nil {
		log.Error("failed to upload avatar", zap.Error(err))
		respWriter.MapError(err)
		return
	}

	resp := UploadImageDTOResponse{
		ImageURL: imageURL,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
