# Hire Hub

Recruitment & Selection platform — manage job postings, applications and candidates.

## Architecture

```
hire-hub/
├── backend/        # Go API (Gin + GORM + PostgreSQL)
├── frontend/       # React SPA (Vite + TypeScript)
├── docker-compose.yml
└── Makefile
```

**Backend:** Go, Gin, GORM, PostgreSQL, golang-migrate, JWT auth (dual tokens)
**Frontend:** React, TypeScript, Vite, Axios, React Router, i18next (EN/PT-BR)

## Quick Start (Docker)

```bash
cp .env.example .env
make build
make up
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432

## Quick Start (Local)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
make run
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
make dev
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `POSTGRES_USER` | PostgreSQL user | `hirehub` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `hirehub` |
| `POSTGRES_DB` | PostgreSQL database | `hirehub` |
| `JWT_ACCESS_SECRET` | JWT access token secret | — |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | — |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

## API Summary

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
| GET | /api/v1/jobs/mine | Yes | My jobs |
| POST | /api/v1/jobs/:id/apply | Yes | Apply to job |
| GET | /api/v1/applications/mine | Yes | My applications |

## Makefile Commands (Root)

| Command | Description |
|---|---|
| `make up` | Start all services |
| `make down` | Stop all services |
| `make build` | Build Docker images |
| `make logs` | Follow service logs |

## Contributing

1. Create a branch: `feature/backend-xxx`, `feature/frontend-xxx`, or `chore/xxx`
2. Make changes with tests
3. Open a PR to `main`
