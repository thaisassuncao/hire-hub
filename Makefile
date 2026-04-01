.PHONY: up up-dev down build logs

up:
	docker compose up -d

up-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f
