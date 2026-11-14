# SMS Architecture

Last audited: 2026-11-06 from the repository only. Containers were not started.

## Repository layout

```
sms/
  backend/          Express API, Prisma schema, migrations, domain modules
  frontend/         Vite React admin and role shells
  packages/shared/  Permissions and user serializer used by both sides
  docker-compose.yml
  docs/
```

The root `package.json` workspace includes only `packages/*`. Frontend and backend are separate npm projects that depend on `@packages/shared` through `file:../packages/shared`.

`packages/shared` is CommonJS (`index.js`). There is no `index.mjs`, despite a comment in the permissions file that refers to one. Vite currently bundles that package for the frontend.

## Frontend

- Entry: `frontend/src/main.jsx` wraps Redux, TanStack Query, and `AuthProvider`.
- Routing: `frontend/src/App.jsx` mounts a public landing page, auth pages, and one route tree per role.
- Admin UI lives in `frontend/src/modules/admin` with pages, hooks, and `api` modules.
- HTTP: `frontend/src/shared/api/axios.js` sends the Bearer access token from the Redux store and refreshes on 401.
- Server state: TanStack Query. `@tanstack/react-query` is imported directly but is only present because `@tanstack/react-query-devtools` depends on it. It should be a direct dependency.
- Navigation: `frontend/src/shared/config/navigationConfig.js` is large and describes routes that do not all exist. It also imports `configureStore` and does not use it.

Role shells under `teachers`, `students`, `parents`, `superAdmin`, `accountant`, and `departmentHead` are mostly static dashboards and mock pages. They are not a second backend.

## Backend

`backend/app.js` mounts:

- `GET /health`
- `/api/v1/auth`
- `/api/v1/admin` (overview only)
- `/api/v1/students`
- `/api/v1/admin/teachers`
- `/api/v1/admin/departments`
- `/api/v1/admin/accountants`

These files exist and are empty, and are not mounted: user routes, parent routes, assignment routes, course routes, grade routes. Several domain folders still contain unused `*.model.js` files from an earlier data-access style. Prisma is the data access layer (`backend/config/prisma.js`, PostgreSQL driver adapter). Duplicate Prisma setup files also exist under `backend/infrastructure/prisma.js`, `backend/config/database.js`, and `backend/config/db.js`.

Controllers call services. Services call Prisma. Validation uses Joi. `backend/utils/response.js` defines a success/error helper that most controllers do not use, so response shapes differ by route.

## Database

PostgreSQL via Prisma 7. The schema URL is in `backend/prisma.config.ts`, not in the Prisma schema `datasource` block.

Current models:

- `School`
- `User` with role enum: `super_admin`, `admin`, `department_head`, `teacher`, `accountant`, `parent`, `student`
- `TeacherProfile` (one-to-one with User)
- `StudentProfile` (one-to-one with User, optional `Class`)
- `Department` (school-scoped, with optional head and teacher-profile relations)
- `Class` (school, grade, section, academic year string, optional homeroom teacher)

Identity is separate from teacher and student profiles. Parent and accountant have no profile tables. There is no parent-student link, subject, academic-year, attendance, exam, grade, announcement, message, fee, or audit table.

Admin accountant management uses the shared `User` model and `accountant` role; it does not create an additional identity or profile. Accountant account management is school-scoped and soft-deactivation preserves user rows. The schema still has no finance transaction models, so the Accountant admin page reports account counts only and does not display invented transaction data.

`User.email` is globally unique. Two schools cannot register the same email. `TeacherProfile.departmentId` optionally relates to `Department` and is cleared when its department is deleted.

Migrations:

- `20260811104008_init_postgresql`
- `20260820111707_add_teacher_profile`
- `20260820140000_add_student_profile` (old `StudentProfile` shape: grade, section, admission number, roll number)
- `20261006082306_add_class_and_student_profile` drops the old student and teacher profile tables and recreates them with the current shape

The student service and Joi schemas still write the dropped fields (`gradeLevel`, `section`, `admissionNumber`, `rollNumber`). The select clause and the schema use `admissionNo`, `class`, `gender`, and related columns. Create, update, and grade filters cannot succeed against the current client.

`listStudents` sets `take` with `Math.min(1, limit)`, so a normal page size collapses to 1 row.

## Authentication

Login (`backend/modules/auth`) checks the password with bcryptjs, issues a 15-minute access token and a 7-day refresh token, and sets the refresh token in an HTTP-only cookie. Access tokens are kept in Redux memory. Redux persistence is not used.

On each authenticated request, `authenticate.js` verifies the access token and reloads the user from the database. Authorization uses that fresh role, not the role claim inside the token. That part is sound.

Gaps:

- `refreshTokenVersion` exists on `User` and is never checked or incremented. Logout only clears the cookie. A stolen refresh token remains valid until it expires.
- Refresh reads `req.cookies.refreshToken` instead of the configured cookie name.
- Login logs the full user record, including `passwordHash`, to stdout.
- `useAuth` publishes the access token into `sessionStorage` for tab sync (`sms-auth-sync-event`). Refresh tokens are not stored there. Access tokens should stay in memory. `sessionStorage` also does not fire `storage` events across tabs, so this write does not do the cross-tab job `BroadcastChannel` already does.
- Password reset pages have no API.
- Login has no rate limit. Responses have no security headers and no compression middleware.
- Unknown errors return `err.message` to the client.

Seed script `backend/script/seed.js` falls back to plaintext demo passwords in source if environment variables are empty. A second seed file exists at `backend/prisma/seed.js`.

`bcrypt` and `bcryptjs` are both dependencies. Application code uses `bcryptjs`.

## Authorization

`packages/shared/permissions/index.js` is the shared permission map. `authorize(...permissions)` allows the request when the role has any listed permission, or the wildcard `all`.

`admin` and `super_admin` both hold `all`. School admin is therefore not limited by the finer permissions declared for teachers, parents, and accountants. Those finer permissions matter only for non-admin roles, and almost no route outside students, teachers, and dashboard overview checks them.

The map has duplicate keys and typos (`MANGE_LOGS`, `MANGE_INTEGRATIONS`, `VIEW_BALANACES`, `manage:anouncements`). Duplicate `VIEW_ATTENDANCE` means the first definition is overwritten. Frontend navigation sometimes checks permissions that do not match the role matrix (`MANAGE_ATTENDANCE` on screens the teacher role does not have).

Frontend `ProtectedRoute` checks the role string only. Admin routes allow `admin` and reject every other role, including `super_admin`. That is a UX gate. The API remains the security boundary.

Settings “roles and permissions” is a separate in-memory mock and is not the shared permission package.

## Multi-tenancy

`tenantScope` runs after authentication. It sets `req.tenant.schoolId` from the database user. For `super_admin` it sets `schoolId` to `null` and `isPlatformAdmin` to true.

Student and dashboard queries treat a missing school id as “no school filter”, so a super admin receives every school’s students and counts. Teacher queries pass `schoolId: null`, which matches only users with a null school. The two modules do not isolate tenants the same way.

There is no school-management API and no request context that lets a platform admin choose a school explicitly. School id from the client is not accepted on teacher create, which is correct. Student create stamps `schoolId` from the tenant. A school admin with a null `schoolId` is rejected by `tenantScope`. A super admin is not.

## API shape

Mounted contracts today:

| Method   | Path                                | Notes                                                 |
| -------- | ----------------------------------- | ----------------------------------------------------- |
| POST     | `/api/v1/auth/login`                | `{ success, message, accessToken, user }` plus cookie |
| POST     | `/api/v1/auth/logout`               | Clears cookie, does not revoke the token              |
| POST     | `/api/v1/auth/refresh-token`        | `{ success, accessToken, user }`                      |
| GET      | `/api/v1/admin/overview`            | `{ data }` mixed live and constant metrics            |
| GET      | `/api/v1/students`                  | `{ data, meta }`                                      |
| GET      | `/api/v1/students/:id`              | `{ data }`                                            |
| POST     | `/api/v1/students`                  | 201 `{ data }`                                        |
| PATCH    | `/api/v1/students/:id`              | `{ data }`                                            |
| DELETE   | `/api/v1/students/:id`              | 204, soft-deactivates                                 |
| PATCH    | `/api/v1/students/:id/status`       | `{ data }`                                            |
| GET/POST | `/api/v1/admin/teachers`            | List and create                                       |
| POST     | `/api/v1/admin/teachers/:id`        | Update. Frontend calls PATCH                          |
| POST     | `/api/v1/admin/teachers/:id/delete` | Delete. Frontend calls DELETE                         |
| POST     | `/api/v1/admin/teachers/:id/status` | Status. Frontend calls PATCH                          |
| GET      | `/api/v1/admin/accountants`         | School-scoped, searchable, paginated accountant users |
| GET      | `/api/v1/admin/accountants/overview`| School-scoped total, active, and inactive counts      |
| GET      | `/api/v1/admin/accountants/:id`     | Single accountant user; other schools return 404     |
| POST     | `/api/v1/admin/accountants`         | Creates an accountant login with a hashed password    |
| PATCH    | `/api/v1/admin/accountants/:id`     | Updates account details; role and school are immutable|
| PATCH    | `/api/v1/admin/accountants/:id/status` | Sets active state; no hard-delete endpoint         |

Teacher create does not accept or hash a password, then writes `passwordHash` from a field Joi strips. Create cannot produce a user who can log in.

Student create falls back to the password `Student123!` when the client omits one.

## Performance

The admin dashboard loads every matching student row to compute an “attendance” rate that is actually the active-user ratio. Development Prisma logging is set to `query`, which records every statement. Student search uses case-insensitive `contains` with no trigram index. Teacher list has no pagination. Express does not compress JSON responses.

Those issues should be fixed inside each slice, not with a separate caching layer.

## Public pages and SEO

`frontend/index.html` title is `frontend`. The favicon href is empty. There is no meta description, canonical URL, Open Graph data, or `noindex` on authenticated shells. The landing page does not set a document title. This is a client-rendered SPA, so public content should stay in the initial HTML where search engines and first paint need it.

## Docker

`docker-compose.yml` runs the backend and Vite frontend; it does not define a PostgreSQL service. The backend receives its environment from `backend/.env`, which is also the source used by the Windows Node process. Both modes use the same Neon `DATABASE_URL`. The backend image excludes `.env` files from its build context and uses Node 22. Compose runs `prisma migrate deploy` before starting the API. Root, backend, and frontend `.env` files are gitignored.

## Integrations

No AI client, payment provider, storage adapter, or mailer is present. Keep those behind interfaces when they are approved. Do not add them before people, academic structure, and real reporting data exist.
