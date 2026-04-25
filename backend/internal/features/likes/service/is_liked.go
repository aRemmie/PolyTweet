package service

import "context"

func (s *LikesService) IsLiked(ctx context.Context, userID, postID string) (bool, error) {
	return s.likesRepo.IsLiked(ctx, userID, postID)
}
