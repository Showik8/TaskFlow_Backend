## Acceptance Criteria

### Authentication

- Register returns 201 with `_id, name, email, token` for unique email.
- Login returns 200 with `_id, name, email, token` for valid credentials.
- Profile GET requires valid JWT and excludes `password`.
- Profile PUT allows updating `name`, `email`, and optional `password` (rehashed).

### Projects

- Create requires `title` and valid `createdBy` (existing user); returns 201 with project.
- Get all returns 200 with populated `members`, `tasks`, and `createdBy`.
- Update validates `id`, updates provided fields; invalid member IDs/users rejected.
- Delete validates `id`, returns 200 and removes the project.
- Get user's projects returns projects where user is `createdBy` or in `members`.

### Tasks

- Create requires `title`, `projectId`, array `assignedTo` with valid user IDs.
- Create adds task to `project.tasks` and returns 201 with task.
- Get project tasks by `/api/task/:id` returns that project's tasks.
- Get by title requires `title` and project `id` query; mismatched project rejected.
- Update validates `taskId`, updates provided fields, coerces `dueDate`.
- Update status only accepts `todo|inProgress|completed`.
- Delete validates `taskId` and returns 200 on success.

### General

- All protected routes require `Authorization: Bearer <token>`.
- Errors use JSON: `{ message, error? }` with correct status codes.
