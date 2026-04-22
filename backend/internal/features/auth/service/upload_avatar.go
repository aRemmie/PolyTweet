package auth_service

import (
	"context"
	"fmt"
	"mime/multipart"
)

func (s *AuthService) UploadAvatar(ctx context.Context, userID string, file multipart.File, filename string) (string, error) {
	avatarURL, err := s.storageClient.UploadFile(file, filename)
	if err != nil {
		return "", fmt.Errorf("upload file: %w", err)
	}

	if err := s.authRepo.UpdateUserProfile(ctx, userID, avatarURL, ""); err != nil {
		return "", fmt.Errorf("update avatar url: %w", err)
	}

	user, err := s.authRepo.GetUserByID(ctx, userID)
	if err != nil {
		return "", fmt.Errorf("get updated user: %w", err)
	}

	if err := s.cacheRepo.SaveUser(user); err != nil {
		return "", fmt.Errorf("update cache: %w", err)
	}

	return avatarURL, nil
}
