include .env
export

up:
	@docker compose up -d --build polytweet db-postgres cache
	@docker compose run --rm db-migrations -path ./migrations -database ${DATABASE_URL} up

down:
	@docker compose down --remove-orphans

test-up:
	@docker compose up -d db-postgres cache

migrate-up:
	@docker compose run --rm db-migrations -path ./migrations -database ${DATABASE_URL} up

migrate-down:
	@docker compose run --rm db-migrations -path ./migrations -database ${DATABASE_URL} down

test-unit:
	@go test -v ./tests/unit/...

swagger:
	@docker compose run --rm swagger init -g cmd/polytweet/main.go -o docs --parseDependency --parseInternal
