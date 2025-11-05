## Security

### Auth Flow

1. User registers or logs in to receive a JWT signed with `JWT_SECRET` (7d expiry).
2. Client sends `Authorization: Bearer <token>`.
3. Middleware verifies token and loads the user (without password) into `req.user`.

### Input Validation

- ObjectId validation via `mongoose.Types.ObjectId.isValid` for params and relations.
- Required fields checked in controllers (`title`, `createdBy`, `projectId`, etc.).
- Enum validation for `priority` and `status` driven by Mongoose schema.

### Sensitive Data Handling

- Passwords hashed with bcrypt (salted) before storage.
- `password` omitted from profile responses.
- Secrets stored in `.env`; never committed. Rotate `JWT_SECRET` if leaked.

### Transport & CORS

- CORS restricted to known origins (`localhost:5173`, deployed frontend).
- Use HTTPS in production; avoid sending tokens over HTTP.

### Common Risks

- Token misuse: return 401 for missing/invalid tokens.
- IDOR: verify resource relationships where applicable.
- Injection: use Mongoose queries and avoid string concatenation.
