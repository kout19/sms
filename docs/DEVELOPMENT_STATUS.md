# Development Status

Audit date: 2026-11-06. Source inspection only. No application code was changed. Docker was not started. Tests were not executed. Backend `npm test` is a script that exits 1. Frontend has Vitest and one shared-package check, `frontend/src/shared/__tests__/verify-shared.test.js`, which was not run in this audit.

The frontend dev server was already running on port 5173 when the audit started. That only shows the Vite process is up. It does not prove API workflows.

## Completed enough to build on

- Express app with health check, CORS credentials, cookie parser, and a central error middleware.
- Prisma 7 client with the PostgreSQL driver adapter, four migrations, and models for School, User, TeacherProfile, StudentProfile, and Class.
- Shared permission package and `authorize` middleware that reloads the user on each request.
- `tenantScope` middleware that refuses a non-super-admin user with no school.
- Login, cookie refresh, memory access token, and Axios 401 refresh. Logout clears the cookie locally.
- Admin route shell, layout, and navigation covering the planned admin areas.
- Student and teacher admin screens call real API modules rather than local arrays.
- Admin overview hook calls `GET /api/v1/admin/overview`.

## Partially implemented

### Authentication

Works for a basic session. Refresh tokens are not revoked. `refreshTokenVersion` is unused. Login writes the user, including the password hash, to the server log. Access tokens are copied into `sessionStorage` during login sync. Forgot-password and reset-password pages have no backend.

### Admin dashboard

`getOverview` counts students, teachers, and parents for the tenant. `totalClasses` is the constant 12. `averagePerformance` is 88.4. `feeCollectionRate` is 81.5. `recentActivity` is three static strings. `attendanceRate` is the percentage of student users with `isActive: true`, computed by loading every student row. The page still falls back to demo numbers when a count is 0, because it treats 0 as missing. Attendance, enrollment, and department charts, plus the recent-activity card, ignore the API and use hardcoded arrays.

### Students

Routes, Joi validation, service, React Query hooks, and the list page exist. The service still writes and filters fields removed by migration `20261006082306_add_class_and_student_profile`. The list page sends `gradeLevel` from a hardcoded grade array, not from `Class`. Pagination is capped at one row. Create uses a default password when none is supplied. Delete is a soft deactivate. A super admin with `schoolId: null` is not filtered to one school.

### Teachers

List and get-by-id are tenant-scoped and match `TeacherProfile`. Create does not set a usable password. Update, delete, and status on the server are POST routes; the frontend calls PATCH and DELETE, so those actions do not hit the handlers. There is no pagination. `departmentId` has no department table. List authorization requires `manage:teachers` even for a read.

### Academic and admin UI shells

These admin areas render, and their hooks use TanStack Query, but the API modules return in-memory data:

- Classes (inline array in the page)
- Departments, subjects, exams, attendance
- Parents, accountants
- Announcements, messages
- Reports, attendance reports, academic reports, financial reports
- Settings, general settings, user management, roles and permissions

Other role modules (teacher, student, parent, accountant, department head, super admin) are navigation plus mock dashboards.

## Missing

- Academic years, departments, sections, and subjects as real tables and APIs.
- Parent profiles and parent-student links. Accountant profiles.
- Attendance, assignments, examinations, gradebooks.
- Announcements, messages, notifications.
- Fees, invoices, payments, receipts.
- File storage, email, SMS, AI.
- School management for super admin.
- Audit log.
- Consistent API envelope.
- Automated tests around auth, tenancy, and students.
- Production HTTP headers, login rate limiting, response compression.
- Public-page SEO: title, description, favicon, and noindex for private app shells.

## Duplication

- Two user stories: live student/teacher users, and mock user management in settings.
- Two permission stories: `@packages/shared` and the settings role mock.
- Two seed entry points: `backend/script/seed.js` and `backend/prisma/seed.js`.
- Empty legacy route files next to the Prisma services.
- More than one Prisma client bootstrap file. Runtime code uses `backend/config/prisma.js`.
- Chart libraries: Chart.js and Recharts are both dependencies.
- `bcrypt` and `bcryptjs` are both installed.

## Architectural and security risks

1. Student writes do not match the database, so the first live people workflow fails at runtime.
2. Super-admin student and dashboard queries are cross-tenant.
3. Refresh tokens cannot be revoked. Logout is not server-side revocation.
4. Secrets and password hashes can reach logs. Access tokens can reach `sessionStorage`.
5. Hardcoded demo passwords in the seed file and a default student password in the service.
6. Admin holds wildcard `all`, so permission checks do not constrain school admins.
7. Dashboard and reports display invented school performance. That is not acceptable in a product school staff will trust.
8. Global unique email blocks legitimate multi-school use.
9. The latest migration drops profile tables. Future migrations must not use that pattern on databases that already hold school data.
10. Unhandled server errors can echo internal messages to clients.

## Database readiness

Ready for a single demo school with users, teacher profiles, student profiles, and classes. Not ready for attendance, grading, finance, communication, or parent relationships. Student application code is behind the latest migration.

## Authentication readiness

Suitable as the base session design. Not production-ready until revocation, log hygiene, cookie-name consistency, and removal of token storage in `sessionStorage` are done. Those fixes should ride along with the next secured feature, not as an unbounded auth rewrite.

## Multi-tenancy readiness

The middleware and “load user from the database” approach are the right base. Enforcement is incomplete and inconsistent between students and teachers. No school CRUD exists.

## Docker and environment readiness

Compose is present and wired to Postgres 16, backend migrate-on-start, and Vite. Local `.env` files exist for the root, backend, and frontend and were not opened. The root Dockerfile is empty. Readiness of a running stack was not verified because this audit did not start containers.

## Admin module status

| Area                              | UI      | API                    | Database       | Verdict                                 |
| --------------------------------- | ------- | ---------------------- | -------------- | --------------------------------------- |
| Dashboard                         | Started | Partial                | Counts only    | Do not finish until source data is real |
| Students                          | Wired   | Broken against schema  | Model exists   | First feature                           |
| Teachers                          | Wired   | Partial, verb mismatch | Model exists   | Immediately after students              |
| Classes                           | Mock    | None                   | Model exists   | Required for real student placement     |
| Departments, subjects             | Mock    | None                   | None           | After classes                           |
| Parents, accountants              | Mock    | None                   | Role enum only | After students and teachers             |
| Attendance, exams                 | Mock    | Empty files            | None           | After people and classes                |
| Reports, finance                  | Mock    | None                   | None           | After operational data                  |
| Messages, announcements, settings | Mock    | None                   | None           | Later                                   |

## Current task

Audit recorded in this file and in `PROJECT_MASTER_PLAN.md`, `ARCHITECTURE.md`, and `API_CONVENTIONS.md`. Waiting for approval before implementation.

## Next recommended task

Repair the Admin Students vertical slice so list, create, update, deactivate, and status work against the current `StudentProfile` and optional `Class` relation.

Why this one, and not the dashboard: the dashboard is already calling the API, but most of what it shows is still sample data. Finishing it now would either keep false metrics or stall on attendance and fees tables that do not exist. Students is the furthest real admin workflow, and it is currently blocked by its own contract: the UI and service still speak the pre-migration profile shape, and the list endpoint returns one row per page.

In that slice, include only the class support students need (list classes for the school and save `classId`). Do not build departments, subjects, or the rest of the dashboard in the same change.

Also include these guards inside the slice, because they are part of making students safe:

- Tenant filter always uses the caller’s school. Define super-admin behavior explicitly instead of returning every school.
- Remove the default password and the password-hash log if that log path is touched.
- Paginate with a real limit cap.
- Match the API envelope in `API_CONVENTIONS.md` for the student routes.

Teachers are the following slice: password hashing, PATCH/DELETE alignment, and pagination.

## Known issues to carry

- Frontend dev server was already running. Backend and database status were not probed.
- No test run was claimed as passing.
- Permission typos and the admin wildcard need a dedicated pass after the first people slice, not a drive-by edit across every navigation file.
