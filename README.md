# Backend Task API

A lightweight TypeScript backend service built with **Fastify** and **Prisma** for managing tasks.

It exposes a REST API for basic task CRUD operations and includes a PostgreSQL-backed `Task` model.

## Requirements

- Node.js 18+
- npm (or compatible package manager)
- Docker (optional, for local PostgreSQL)

## Project setup

```bash
npm install
```

## Environment

Create a `.env` file in the project root. A default example used by this project is:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager?schema=public"
```

## Local database (PostgreSQL)

You can run PostgreSQL with Docker:

```bash
docker-compose up -d
```

## Prisma

Generate the Prisma client (after installing dependencies):

```bash
npx prisma generate
```

Create/migrate database schema:

```bash
npx prisma migrate dev --name init
```

## Run in development

```bash
npm run dev
```

The server starts by default on `http://localhost:3000`.

## Production build & start

```bash
npm run build
npm start
```

## API

### Health check

`GET /health`

Response:

```json
{ "status": "ok" }
```

### Tasks

Base path: `/tasks`

- `GET /tasks`
  - Returns all tasks ordered by `createdAt` descending.

- `GET /tasks/{id}`
  - Returns a single task by id.
  - Returns `404` if the task is not found.

- `POST /tasks`
  - Creates a new task.

Example request body:

```json
{
  "title": "Finish README",
  "description": "Document API endpoints",
  "status": "TODO",
  "priority": "HIGH"
}
```

- `PATCH /tasks/{id}`
  - Updates a task by id.
  - Returns `404` if the task is not found.

- `DELETE /tasks/{id}`
  - Deletes a task by id.
  - Returns `204` on success, `404` if not found.

## Notes on data layer behavior

This project currently has mixed persistence behavior:

- `GET /tasks`, `GET /tasks/{id}`, and `POST /tasks` use Prisma with PostgreSQL.
- `PATCH /tasks/{id}` and `DELETE /tasks/{id}` are currently implemented against an in-memory store.

For consistency, those handlers should be migrated to Prisma as a next step.

## Data model

`Task` entity fields:

- `id`: UUID
- `title`: string
- `description`: optional string
- `status`: `TODO` | `IN_PROGRESS` | `DONE` (default `TODO`)
- `priority`: `LOW` | `MEDIUM` | `HIGH` (default `MEDIUM`)
- `createdAt`: timestamp (default now)
- `updatedAt`: timestamp (auto-updated)

## Scripts

- `npm run dev` – runs TypeScript server with `tsx` watcher
- `npm run build` – compiles TypeScript
- `npm start` – runs compiled `dist/server.js`