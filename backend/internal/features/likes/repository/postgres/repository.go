package postgres

import postgres_pool "github.com/tryingmyb3st/PolyTweet/internal/core/repository/postgres"

type LikesRepository struct {
	ConnPool postgres_pool.Pool
}

func NewLikesRepository(connPool postgres_pool.Pool) *LikesRepository {
	return &LikesRepository{
		ConnPool: connPool,
	}
}
