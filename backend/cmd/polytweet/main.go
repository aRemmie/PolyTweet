package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	likes_repository "github.com/tryingmyb3st/PolyTweet/internal/features/likes/repository/postgres"
	likes_cache "github.com/tryingmyb3st/PolyTweet/internal/features/likes/repository/redis"
	likes_service "github.com/tryingmyb3st/PolyTweet/internal/features/likes/service"
	likes_transport "github.com/tryingmyb3st/PolyTweet/internal/features/likes/transport"
	posts_repository "github.com/tryingmyb3st/PolyTweet/internal/features/posts/repository/postgres"
	posts_cache "github.com/tryingmyb3st/PolyTweet/internal/features/posts/repository/redis"
	posts_service "github.com/tryingmyb3st/PolyTweet/internal/features/posts/service"
	posts_transport "github.com/tryingmyb3st/PolyTweet/internal/features/posts/transport/http"
	"go.uber.org/zap"

	_ "github.com/tryingmyb3st/PolyTweet/docs"
	"github.com/tryingmyb3st/PolyTweet/internal/core/logger"
	postgres_pool "github.com/tryingmyb3st/PolyTweet/internal/core/repository/postgres"
	cache "github.com/tryingmyb3st/PolyTweet/internal/core/repository/redis"
	"github.com/tryingmyb3st/PolyTweet/internal/core/transport/server"
	auth_repository "github.com/tryingmyb3st/PolyTweet/internal/features/auth/repository/postgres"
	auth_cache "github.com/tryingmyb3st/PolyTweet/internal/features/auth/repository/redis"
	auth_service "github.com/tryingmyb3st/PolyTweet/internal/features/auth/service"
	auth_transport "github.com/tryingmyb3st/PolyTweet/internal/features/auth/transport/http"
)

// @title Poly Twitter Service
// @version 1.0
// @host 127.0.0.1:8080
func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("error with reading .env")
		os.Exit(1)
	}

	log, err := logger.NewLogger(logger.NewConfigMust())
	if err != nil {
		fmt.Println("error with initializing new logger")
		os.Exit(1)
	}
	defer log.Close()

	log.Debug("logger initialized successfully")

	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGTERM, syscall.SIGINT)
	defer cancel()

	pool, err := postgres_pool.NewConnectionPool(ctx, postgres_pool.NewConfigMust())
	if err != nil {
		log.Fatal("creating new pgxPool", zap.Error(err))
	}
	defer pool.Close()
	log.Debug("postgres pool initialized successfully")

	cache, err := cache.NewCacheClient(ctx, cache.NewConfigMust())
	if err != nil {
		log.Fatal("creating new cache", zap.Error(err))
	}
	defer cache.Close()
	log.Debug("redis cache initialized successfully")

	serv := server.NewHTTPServer(server.NewConfigMust(), log)

	log.Debug("initializing auth service")
	authRepo := auth_repository.NewAuthRepository(pool)
	cacheAuthRepo := auth_cache.NewAuthCache(cache)
	authService := auth_service.NewAuthService(authRepo, cacheAuthRepo)
	authHandler := auth_transport.NewAuthHandler(authService)

	serv.RegisterRoutes(authHandler.Routes()...)

	log.Debug("initializing posts service")
	postsRepo := posts_repository.NewPostsRepository(pool)
	cachePostsRepo := posts_cache.NewPostsCache(cache)
	postsService := posts_service.NewPostsService(postsRepo, cachePostsRepo)
	postsHandler := posts_transport.NewPostsHandler(postsService)

	serv.RegisterRoutes(postsHandler.Routes()...)

	log.Debug("initializing likes service")
	likesRepo := likes_repository.NewLikesRepository(pool)
	cacheLikesRepo := likes_cache.NewLikesCache(cache)
	likesService := likes_service.NewLikesService(likesRepo, *postsService, cacheLikesRepo)
	likesHandler := likes_transport.NewLikesHandler(likesService)

	serv.RegisterRoutes(likesHandler.Routes()...)

	serv.RegisterSwagger()

	if err = serv.Run(ctx); err != nil {
		log.Error("server error occurred", zap.Error(err))
	}
}
