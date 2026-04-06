# ERROR CODES

| Error Code | HTTP Status | Description |
|---|---|---|
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_EMAIL` | 409 | Email already registered |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `EXPIRED_TOKEN` | 401 | JWT token has expired |
| `INVALID_TOKEN` | 401 | JWT token is malformed or invalid |
| `UNAUTHORIZED` | 401 | Missing or invalid Authorization header |
| `ALREADY_APPLIED` | 409 | User already applied to this job |
| `OWN_JOB` | 403 | Cannot apply to a job you posted |
| `INACTIVE_JOB` | 400 | Job is no longer accepting applications |
| `NOT_OWNER` | 403 | Cannot modify a resource you don't own |
| `VALIDATION_ERROR` | 422 | Request body failed validation |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
