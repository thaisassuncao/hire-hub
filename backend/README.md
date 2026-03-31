# Hire-Hub Backend

Go API server for the Hire-Hub recruitment platform.

## Tech Stack

- **Go** with Gin web framework
- **PostgreSQL** with GORM
- **golang-migrate** for SQL migrations

## Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your PostgreSQL credentials.

3. Install dependencies:
   ```bash
   go mod tidy
   ```

4. Run the server:
   ```bash
   make run
   ```

## Available Commands

| Command | Description |
|---|---|
| `make run` | Start the development server |
| `make build` | Build the binary to `bin/server` |
| `make migrate-up` | Run all pending migrations |
| `make migrate-down` | Rollback the last migration |
| `make migrate-create name=xxx` | Create a new migration pair |

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `8080` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

## API

- `GET /api/v1/health` — Health check
