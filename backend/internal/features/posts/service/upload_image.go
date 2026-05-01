package service

import (
	"context"
	"fmt"
	"mime/multipart"
)

func (s *PostsService) UploadImage(ctx context.Context, file multipart.File, filename string) (string, error) {
	imageURL, err := s.storageClient.UploadFile(file, filename)
	if err != nil {
		return "", fmt.Errorf("upload file: %w", err)
	}

	return imageURL, nil
}
