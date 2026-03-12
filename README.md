# Backend Task API

Collaborative task management backend built with TypeScript, Fastify, Prisma, and PostgreSQL.

## Stack

- Node.js
- TypeScript
- Fastify
- `@fastify/jwt`
- `@fastify/cookie`
- Prisma with `@prisma/adapter-pg`
- PostgreSQL
- Argon2

## Features

- User registration and login
- JWT access tokens
- Refresh token rotation with database-backed sessions
- Project CRUD
- Project membership with `ADMIN` and `MEMBER` roles
- Task CRUD scoped under a project
- Permission checks based on project membership and role
- Project deletion that also removes its tasks

## Data model

The Prisma schema defines:

- `User`
- `Session`
- `Project`
- `ProjectMember`
- `Task`

Enums:

- `TaskStatus`: `TODO`, `IN_PROGRESS`, `DONE`
- `TaskPriority`: `LOW`, `MEDIUM`, `HIGH`
- `Role`: `ADMIN`, `MEMBER`

Relationship summary:

- A `User` can own multiple projects.
- A `Project` has many members through `ProjectMember`.
- A `Task` belongs to one project.
- A `Task` can optionally have an assignee.
- Deleting a project removes its tasks and membership records.

## Local setup

### Requirements

- Node.js 18+
- npm
- PostgreSQL

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager?schema=public"
JWT_SECRET="super_secret"
NODE_ENV=development
```

### Start PostgreSQL with Docker

```bash
docker-compose up -d
```

Docker configuration in [`docker-compose.yml`](/c:/Users/micha/Desktop/Projects/Backend/docker-compose.yml):

- image: `postgres:16`
- database: `task_manager`
- user: `postgres`
- password: `postgres`
- port: `5432`

### Prisma

Generate the client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Current migrations:

- `20260309194817_init`
- `20260310085600_session_remove_revoked_at`
- `20260311080949_add_project`
- `20260312151224_cascade_project_task`

## Running the app

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Run compiled output:

```bash
npm start
```

Default base URL: `http://localhost:3000`

Health check:

```http
GET /health
```

Response:

```json
{ "status": "ok" }
```

## Scripts

- `npm run dev`: runs `tsx watch src/server.ts`
- `npm run build`: compiles TypeScript to `dist`
- `npm start`: runs `node dist/server.js`

## Authentication

### Access token

- signed with `JWT_SECRET`
- payload includes `sub` and `email`
- expires in `15m`

### Refresh token

- stored in the `refreshToken` cookie
- `httpOnly: true`
- `sameSite: "lax"`
- `path: "/"`
- `secure: true` only when `NODE_ENV=production`
- session lifetime: 7 days

### `POST /auth/register`

Body:

```json
{
  "name": "Michael",
  "email": "michael@example.com",
  "password": "password123"
}
```

Responses:

- `201`

```json
{
  "name": "Michael",
  "email": "michael@example.com"
}
```

- `409`

```json
{
  "message": "Email already in use"
}
```

### `POST /auth/login`

Body:

```json
{
  "email": "michael@example.com",
  "password": "password123"
}
```

Responses:

- `200`

```json
{
  "accessToken": "jwt-token"
}
```

- `401`

```json
{
  "message": "Invalid credentials"
}
```

### `POST /auth/refresh`

Reads the `refreshToken` cookie and rotates the session.

Responses:

- `200`

```json
{
  "accessToken": "new-jwt-token"
}
```

- `401`

```json
{
  "message": "Unauthorized"
}
```

If an already used refresh token is reused, all sessions for that user are deleted.

### `POST /auth/logout`

Requires a valid access token in the `Authorization` header.

Behavior:

- marks the current refresh token as used if the cookie exists
- clears the `refreshToken` cookie

Response:

- `200` with an empty body

## Authorization

Protected routes require:

```http
Authorization: Bearer <accessToken>
```

Project access is enforced through project membership. If the project does not exist or the user is not a member, the current implementation generally returns `404`.

## Project API

All project routes require authentication.

### Permissions

- Any authenticated user can create a project.
- Any project member can view projects they belong to.
- Only project `ADMIN` members can update project details.
- Only the project owner can delete the project.
- Only project `ADMIN` members can add new members.

### `GET /projects`

Returns all projects where the current user is a member.

Actual current response:

- controller returns `201`
- schema declares `200`

Body:

```json
{
  "data": [
    {
      "id": "project-id",
      "name": "Backend API",
      "description": "Task manager backend",
      "ownerId": "user-id",
      "createdAt": "2026-03-12T10:00:00.000Z"
    }
  ]
}
```

### `POST /projects`

Body:

```json
{
  "name": "Backend API",
  "description": "Task manager backend"
}
```

Behavior:

- creates the project
- sets the creator as `ownerId`
- adds the creator to `ProjectMember` as `ADMIN`

Response:

- `201`

```json
{
  "id": "project-id",
  "name": "Backend API",
  "description": "Task manager backend",
  "ownerId": "user-id",
  "createdAt": "2026-03-12T10:00:00.000Z"
}
```

### `GET /projects/:id`

Returns the project if the current user is a member.

Responses:

- `200` with the project object
- `404` if the project is missing or inaccessible

### `PATCH /projects/:id`

Body can include either or both:

```json
{
  "name": "Renamed project",
  "description": "Updated description"
}
```

Permissions:

- allowed only for project members with role `ADMIN`

Actual current response:

- controller returns `201`
- schema declares `200`

Responses:

- `201` with the updated project
- `403` if the user is not an admin
- `404` if the project is missing or inaccessible

### `DELETE /projects/:id`

Permissions:

- allowed only for the project owner

Behavior:

- deletes all tasks in the project
- deletes the project
- related membership rows are also removed

Responses:

- `204`
- `403` if the current user is not the owner
- `404` if the project does not exist

### `POST /projects/:id/members`

Body:

```json
{
  "email": "teammate@example.com",
  "role": "MEMBER"
}
```

Permissions:

- allowed only for project members with role `ADMIN`

Behavior:

- looks up the target user by email
- creates a `ProjectMember` row

Actual current response:

- controller returns `200` with an empty body
- schema currently declares a member object

Error responses:

- `403` if the current user is not an admin
- `404` if the project is inaccessible or the target user does not exist

## Task API

All task routes require authentication and project membership.

Base route:

```http
/projects/:projectId/tasks
```

### Permissions

- `GET` list: any project member
- `GET` by id: any project member
- `POST`: any project member
- `PATCH`: project `ADMIN` or the current assignee
- `DELETE`: project `ADMIN` only

Note:

- the API currently does not expose task assignment endpoints
- because of that, non-admin task updates only work if `assigneeId` was set some other way

### `GET /projects/:projectId/tasks`

Returns tasks ordered by `createdAt` descending.

Response:

- `200`

```json
{
  "data": [
    {
      "id": "task-id",
      "title": "Finish README",
      "description": "Document the API",
      "createdAt": "2026-03-12T10:10:00.000Z",
      "status": "TODO",
      "priority": "HIGH"
    }
  ]
}
```

### `POST /projects/:projectId/tasks`

Body:

```json
{
  "title": "Finish README",
  "description": "Document the API",
  "status": "TODO",
  "priority": "HIGH"
}
```

Rules:

- `title` is required
- `status` defaults to `TODO`
- `priority` defaults to `MEDIUM`

Response:

- `201`

```json
{
  "data": {
    "id": "task-id",
    "title": "Finish README",
    "description": "Document the API",
    "createdAt": "2026-03-12T10:10:00.000Z",
    "updatedAt": "2026-03-12T10:10:00.000Z",
    "status": "TODO",
    "priority": "HIGH",
    "projectId": "project-id"
  }
}
```

### `GET /projects/:projectId/tasks/:id`

Responses:

- `200`

```json
{
  "data": {
    "id": "task-id",
    "title": "Finish README",
    "description": "Document the API",
    "createdAt": "2026-03-12T10:10:00.000Z",
    "updatedAt": "2026-03-12T10:10:00.000Z",
    "status": "TODO",
    "priority": "HIGH",
    "projectId": "project-id"
  }
}
```

- `404`

```json
{
  "message": "Task not found"
}
```

### `PATCH /projects/:projectId/tasks/:id`

Body can include any of:

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

Responses:

- `200` with updated task data
- `403` if the user is neither admin nor assignee
- `404` if the task does not exist

### `DELETE /projects/:projectId/tasks/:id`

Responses:

- `204`
- `403` if the current user is not an admin
- `404` if the task does not exist

## Current implementation notes

- Fastify logging is enabled.
- The server listens on `0.0.0.0`.
- `DATABASE_URL` is loaded in `src/lib/prisma.ts`.
- JWT authentication is provided by a Fastify decorator named `authenticate`.
- Project membership checks are handled by `assertProjectAccess`.

## Known API mismatches

These are present in the current code and worth normalizing later:

- `GET /projects` currently returns `201`, while its schema says `200`.
- `PATCH /projects/:id` currently returns `201`, while its schema says `200`.
- `POST /projects/:id/members` returns an empty `200` body, while its schema expects a member object.

## Next improvements

- Expose task assignment through the API.
- Normalize project route status codes and response schemas.
