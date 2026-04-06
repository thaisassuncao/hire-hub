# Hire Hub

Recruitment & Selection platform to manage job postings, applications and candidates.

## Architecture

```
hire-hub/
├── backend/           # Go API (Gin + GORM + PostgreSQL)
├── frontend/          # React SPA (Vite + TypeScript)
├── docker-compose.yml
└── Makefile
```

**Backend:** Go, Gin, GORM, PostgreSQL, golang-migrate, JWT (dual tokens)
**Frontend:** React, TypeScript, Vite, Axios, React Router, i18next (PT-BR/EN)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (to run via Docker)
- [Go 1.26+](https://go.dev/dl/) (for local backend development)
- [Node.js 25+](https://nodejs.org/) and npm (for local frontend development)

## Quick Start (Docker)

The simplest way to run the project. No Go or Node installation required.

```bash
git clone https://github.com/thaisassuncao/hire-hub.git
cd hire-hub
cp .env.example .env
make build
make up
```

Access:
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:8081
- **PostgreSQL:** localhost:5433

The database comes with 5 sample job postings (seed data) for testing.

To stop: `make down`

> Docker uses different ports than local dev (8080/5173/5432) to avoid conflicts. Configurable via `DOCKER_*_PORT` in `.env`.

## Quick Start (Local)

For development with hot reload.

### 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

This starts PostgreSQL on port 5433.

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set the `DATABASE_URL` pointing to postgres:

```
DATABASE_URL=postgres://hirehub:hirehub@localhost:5433/hirehub?sslmode=disable
```

```bash
make run
```

Backend runs on http://localhost:8080.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
make dev
```

Frontend runs on http://localhost:5173.

## Environment Variables

### Root (`.env` — Docker)

| Variable | Description | Default |
|---|---|---|
| `POSTGRES_USER` | PostgreSQL user | `hirehub` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `hirehub` |
| `POSTGRES_DB` | PostgreSQL database | `hirehub` |
| `JWT_ACCESS_SECRET` | Access token secret | `change-me-access-secret` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `change-me-refresh-secret` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3001` |
| `DOCKER_PG_PORT` | PostgreSQL host port | `5433` |
| `DOCKER_BACKEND_PORT` | Backend host port | `8081` |
| `DOCKER_FRONTEND_PORT` | Frontend host port | `3001` |

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `8080` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `JWT_ACCESS_SECRET` | Access token secret | — |
| `JWT_REFRESH_SECRET` | Refresh token secret | — |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080/api/v1` |

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/v1/auth/register | No | Create account |
| POST | /api/v1/auth/login | No | Login |
| POST | /api/v1/auth/refresh | No | Refresh tokens |
| GET | /api/v1/auth/me | Yes | Current user |
| POST | /api/v1/jobs | Yes | Create job |
| GET | /api/v1/jobs | No | List active jobs |
| GET | /api/v1/jobs/search?q= | No | Search jobs |
| GET | /api/v1/jobs/:id | No | Job details |
| PUT | /api/v1/jobs/:id | Yes | Update own job |
| DELETE | /api/v1/jobs/:id | Yes | Delete own job (soft delete) |
| PATCH | /api/v1/jobs/:id/close | Yes | Close own job |
| GET | /api/v1/jobs/mine | Yes | My jobs |
| POST | /api/v1/jobs/:id/apply | Yes | Apply to job |
| GET | /api/v1/jobs/:id/applied | Yes | Check if applied |
| GET | /api/v1/applications/mine | Yes | My applications |

## Makefile Commands (Root)

| Command | Description |
|---|---|
| `make up` | Start all services |
| `make up-dev` | Start with hot reload (Vite + go run) |
| `make down` | Stop all services |
| `make build` | Build Docker images |
| `make logs` | Follow service logs |

## Running Tests

```bash
# Backend
cd backend
go test -race ./...
golangci-lint run ./...

# Frontend
cd frontend
npm test
npx tsc --noEmit
npx eslint .
```

## Contributing

1. Create a branch: `feature/backend-xxx`, `feature/frontend-xxx`, or `chore/xxx`
2. Make changes with tests
3. Open a PR to `main`
