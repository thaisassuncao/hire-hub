# Hire-Hub Frontend

React SPA for the Hire-Hub recruitment platform.

## Tech Stack

- **React** with TypeScript (Vite)
- **Axios** for API calls
- **React Router** for routing
- **i18next** for internationalization (EN/PT-BR)

## Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   make dev
   ```

## Available Commands

| Command | Description |
|---|---|
| `make dev` | Start dev server |
| `make build` | Production build |
| `make lint` | TypeScript type check |
| `make preview` | Preview production build |

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080/api/v1` |
