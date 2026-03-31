.PHONY: run build migrate-up migrate-down migrate-create

run:
	go run ./cmd/server

build:
	go build -o bin/server ./cmd/server

migrate-up:
	@source .env 2>/dev/null; \
	migrate -path migrations -database "$$DATABASE_URL" up

migrate-down:
	@source .env 2>/dev/null; \
	migrate -path migrations -database "$$DATABASE_URL" down 1

migrate-create:
	@if [ -z "$(name)" ]; then echo "Usage: make migrate-create name=xxx"; exit 1; fi
	@timestamp=$$(date +%s); \
	touch migrations/$${timestamp}_$(name).up.sql; \
	touch migrations/$${timestamp}_$(name).down.sql; \
	echo "Created migrations/$${timestamp}_$(name).up.sql"; \
	echo "Created migrations/$${timestamp}_$(name).down.sql"
