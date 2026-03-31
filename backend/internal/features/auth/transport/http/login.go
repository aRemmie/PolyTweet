package auth_transport

import (
	"encoding/json"
	"net/http"

	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/response"

	"github.com/tryingmyb3st/PolyTweet/internal/core/domain"
	"go.uber.org/zap"
)

type LoginDTO struct {
	Email    string `json:"email" example:"useremail@gmail.com"`
	Password string `json:"password" example:"supersecretpass"`
}

type LoginDTOResponse struct {
	Token string `json:"token"`
}

// LoginUser godoc
// @Summary Авторизация по email и паролю
// @Description Авторизует пользователя по email и паролю, возвращает JWT. Для авторизации в рамках теста - /dummyLogin.
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body LoginDTO true "тело запроса"
// @Success 200 {object} LoginDTOResponse "Успешная авторизация"
// @Failure 401 {object} domain.CustomError "Неверные учётные данные"
// @Failure 500 {object} domain.InternalError "Внутренняя ошибка сервера"
// @Router /login [post]
func (h *AuthHTTPHandler) LoginUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	log := ctx.Value("log").(*logger.Logger)
	respWriter := response.NewResponseHandler(log, w)

	var req LoginDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Debug("error reguster decoding", zap.Error(err))

		respWriter.ErrorResponse(domain.INVALID_REQUEST, http.StatusBadRequest)
		return
	}

	jwt, err := h.AuthService.LoginUser(ctx, req.Email, req.Password)

	if err != nil {
		log.Error("get user", zap.Error(err))

		respWriter.MapError(err)
		return
	}

	resp := LoginDTOResponse{
		Token: *jwt,
	}

	respWriter.JSONResponse(resp, http.StatusOK)
}
