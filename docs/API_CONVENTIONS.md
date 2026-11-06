# API Conventions

Last audited: 2026-11-06. These are the rules for new and corrected endpoints. Existing routes do not all follow them yet. When a slice is finished, bring that slice in line with this document.

## Versioning and transport

- Base path: `/api/v1`.
- JSON request and response bodies.
- Resource names are plural nouns: `/students`, `/teachers`, `/classes`.
- Use HTTP verbs for their usual meaning. Updates are `PATCH`. Deletes are `DELETE`. Do not add `POST /:id/delete`.
- Authenticated routes run `authenticate`, then `tenantScope`, then `authorize`.

## Authorization and tenancy

- Never read `schoolId`, `userId`, or `role` from the body, query, or route for access control.
- Scope every school-owned query with `req.tenant.schoolId`.
- `super_admin` must not silently query every tenant. Platform routes either require an explicit school context that the server authorizes, or they are separate platform endpoints.
- Check a named permission from `@packages/shared`. Do not compare role strings inside controllers.
- `all` may remain the school-admin wildcard only after the permission list for `admin` is reviewed. New code should still declare the permission the action needs.

## Success responses

```json
{
  "success": true,
  "message": "Students retrieved",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 1
  }
}
```

- `data` is the resource or list.
- `meta` is present on collections. Omit it on a single resource when it adds nothing.
- `message` is a short human string.
- Use 200 for reads and updates, 201 for creates, 204 only when there is truly no body. If the client needs the deleted id, return 200 with `data`.

Auth login and refresh may keep `accessToken` beside `data` only if documented. Prefer:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "...",
    "user": {}
  }
}
```

The refresh token stays in the HTTP-only cookie and never appears in JSON.

## Errors

```json
{
  "success": false,
  "message": "Student not found",
  "errors": null
}
```

- 400 validation, 401 missing or invalid token, 403 authenticated but not allowed, 404 hidden or missing tenant resource, 409 unique conflict.
- Validation errors return a list of field messages in `errors`.
- 500 messages are generic in every environment. Log the real error on the server.
- A missing record in another school is 404, not 403, so existence is not revealed.

## Pagination, filter, and search

- Query params: `page` (default 1), `limit` (default 20, maximum 100), `search`, plus explicit filters.
- Invalid numbers fall back to defaults. Never pass `take: 0` or an unbounded `findMany` for a table that grows with enrollment.
- Sort must be stable, for example `createdAt desc, id desc`.
- Search is case-insensitive and limited to intended columns.

## Validation

- Validate with Joi (current choice) at the controller edge.
- Reject unknown fields.
- Do not accept `passwordHash`, `role`, or `schoolId` from the client.
- Passwords are hashed in the service. Minimum length and a real temporary-password or invite flow replace hardcoded defaults.

## Idempotency and writes

- Creates that touch `User` and a profile run in one Prisma nested write or an explicit transaction.
- Soft-delete is `isActive: false` and must be named that way in the API documentation. Hard delete is a separate, explicit decision.
- Status changes use `PATCH /:id/status` with a body, or a dedicated verb that cannot be confused with a field update.

## Logging and privacy

- Do not log passwords, password hashes, access tokens, or refresh tokens.
- Do not return `passwordHash` from any serializer. `toSafeUser` is the user shape for auth responses.
