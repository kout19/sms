# Development Status

Audit date: 2026-11-06. Students management, student directory search, and admin teacher management were implemented and verified later the same day. Admin accountant account management was implemented on 2026-11-11; other sections remain as previously audited. Backend `npm test` is still a script that exits 1. Verification for each feature is described in its section.

The frontend dev server was already running on port 5173 when the audit started. That only shows the Vite process is up. It does not prove API workflows.

## Completed enough to build on

- Express app with health check, CORS credentials, cookie parser, and a central error middleware.
- Prisma 7 client with the PostgreSQL driver adapter, six migrations, and models for School, User, TeacherProfile, StudentProfile, and Class.
- Shared permission package and `authorize` middleware that reloads the user on each request.
- `tenantScope` middleware that refuses a non-super-admin user with no school.
- Login, cookie refresh, memory access token, and Axios 401 refresh. Logout clears the cookie locally.
- Admin route shell, layout, and navigation covering the planned admin areas.
- Student and teacher admin screens call real API modules rather than local arrays.
- Admin Accountant account management uses real, school-scoped API data and TanStack Query.
- Admin overview hook calls `GET /api/v1/admin/overview`.

### Accountants

The admin Accountant page lists real `User` records with the `accountant` role. It supports debounced server-side name/email/phone search, active-status filtering, pagination, detail view, account edits, password reset by an authorized admin, account creation, and activation/deactivation. Create hashes the required admin-supplied password and assigns the role server-side; role, password hash, and school id are never accepted from the client. Reads and writes require `manage:users` and use the authenticated school scope. Deactivation retains the user record. The current schema has no Accountant profile or financial transaction models, so no profile fields, transaction feed, or finance totals are fabricated. No schema or migration change was needed.

## Partially implemented

### Authentication

Works for a basic session. Refresh tokens are not revoked. `refreshTokenVersion` is unused. Login writes the user, including the password hash, to the server log. Access tokens are copied into `sessionStorage` during login sync. Forgot-password and reset-password pages have no backend.

### Admin dashboard

`getOverview` counts students, teachers, and parents for the tenant. `totalClasses` is the constant 12. `averagePerformance` is 88.4. `feeCollectionRate` is 81.5. `recentActivity` is three static strings. `attendanceRate` is the percentage of student users with `isActive: true`, computed by loading every student row. The page still falls back to demo numbers when a count is 0, because it treats 0 as missing. Attendance, enrollment, and department charts, plus the recent-activity card, ignore the API and use hardcoded arrays.

### Students

Admin list, create, edit, view, and deactivate now use the current `StudentProfile` and optional `Class` link. Excel `.xlsx` import previews rows and saves only the valid ones. Pagination accepts a real page size up to 100. A school user with no school, including super admin, is rejected on these routes. There is still no parent account relationship: guardian name, phone, and email are fields on the student. Delete deactivates the login and keeps the row. Verified on 2026-11-06 against PostgreSQL and in the admin UI.

Directory search waits 450ms after typing stops, then queries with the trimmed value. Repeating the same trimmed value does not send another request. The list stays on screen while the next page of results loads, and the in-flight request is cancelled when the query key changes. Search matches first name, last name, a two-part full name, email, and admission number. `pg_trgm` indexes cover those four columns, plus a `(schoolId, role, createdAt)` index for the default list. Verified on 2026-11-06: rapid typing produced one request, a padded admission number matched, an unknown school id returned no rows, and an invalid class id returned 400.

### Teachers

The admin list is a table in the same layout as students: name and employee ID, contact, homeroom, status, and view, edit, and deactivate actions. Add Teacher opens `/admin/teachers/add`. Create hashes a password and writes the user and `TeacherProfile` together. Delete sets `isActive` to false and keeps the row. Search waits 450ms and matches name, email, phone, and employee ID. Filters are homeroom class and account status, both applied in PostgreSQL with pagination. Employee IDs are unique per school. There is no department table and no subject table, so those columns and filters are not shown, and the API rejects a department assignment. Reads and writes require `manage:teachers`. A school user with no school is rejected. A student token receives 403. A teacher id looked up with another school id is hidden. Verified on 2026-11-06 against PostgreSQL and in the admin UI.

### Academic and admin UI shells

These admin areas render, and their hooks use TanStack Query, but the API modules return in-memory data:

- Classes (inline array in the page)
- Departments, subjects, exams, attendance
- Parents
- Announcements, messages
- Reports, attendance reports, academic reports, financial reports
- Settings, general settings, user management, roles and permissions

Other role modules (teacher, student, parent, accountant, department head, super admin) are navigation plus mock dashboards.

## Missing

- Academic years, departments, sections, and subjects as real tables and APIs.
- Parent profiles and parent-student links. Accountant profiles are not required by the current role-based `User` model.
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

1. Closed on 2026-11-06: student and teacher account writes match the current profile tables.
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

Ready for a single demo school with users, teacher profiles, student profiles, and classes. Teacher profiles now store `schoolId` so employee IDs can be unique inside one school. Not ready for attendance, grading, finance, communication, departments, subjects, or parent relationships.

## Authentication readiness

Suitable as the base session design. Not production-ready until revocation, log hygiene, cookie-name consistency, and removal of token storage in `sessionStorage` are done. Those fixes should ride along with the next secured feature, not as an unbounded auth rewrite.

## Multi-tenancy readiness

The middleware and “load user from the database” approach are the right base. Enforcement is incomplete and inconsistent between students and teachers. No school CRUD exists.

## Docker and environment readiness

Compose runs the backend and Vite frontend; the backend receives the same Neon configuration from `backend/.env` as the Windows Node process. No PostgreSQL service is defined in Compose. The backend image excludes `.env` files and uses Node 22. Neon connectivity was verified from Windows and Docker; the older local PostgreSQL container is stopped and its named volume is preserved. The root Dockerfile is empty.

## Admin module status

| Area                              | UI      | API                                                  | Database          | Verdict                                 |
| --------------------------------- | ------- | ---------------------------------------------------- | ----------------- | --------------------------------------- |
| Dashboard                         | Started | Partial                                              | Counts only       | Do not finish until source data is real |
| Students                          | Working | Create, update, import, deactivate, debounced search | Profile and class | Verified 2026-11-06                     |
| Teachers                          | Working | Table, create, update, deactivate, search, status    | Profile and user  | Verified 2026-11-06                     |
| Classes                           | Mock    | None                                                 | Model exists      | Required for real student placement     |
| Departments, subjects             | Mock    | None                                                 | None              | After classes                           |
| Parents, accountants              | Mock    | None                                                 | Role enum only    | After students and teachers             |
| Attendance, exams                 | Mock    | Empty files                                          | None              | After people and classes                |
| Reports, finance                  | Mock    | None                                                 | None              | After operational data                  |
| Messages, announcements, settings | Mock    | None                                                 | None              | Later                                   |

## Current task

Admin Students search and the Admin Teachers table are verified. Stopped before the next admin feature.

## Next recommended task

Classes: the class table and student assignment already exist, but the admin Classes screen is still mock data. Departments and subjects are still not tables, so teacher department and subject assignment stay out of this slice.

## Known issues to carry

- Login still writes the user record, including the password hash, to the server log. That path was not part of this slice.
- Refresh tokens are still not revoked on logout.
- The admin role still has the wildcard permission `all`.
- Student responses do not yet use the full `{ success, message, data }` envelope from `API_CONVENTIONS.md`. List returns `{ data, meta }` and writes return `{ data }`. Teacher responses include `success` and `message`.
- `.xls` workbooks are rejected. ExcelJS reads `.xlsx` values and does not run macros.
- Imports are limited to 100 rows and 2 MB. Valid rows are saved together. Invalid rows and duplicates are reported and skipped. If the database rejects the valid batch, none of that batch is kept.
- Permission typos in the shared map remain.
- Teacher reads use `manage:teachers` because there is no separate view permission.
- The standard local frontend port is `http://localhost:5173`. The repo is configured to enforce that port via Vite's `strictPort: true` behavior. If 5173 is already occupied by another process, Vite will fail instead of silently switching ports, so the conflict must be resolved before the app can run on the standard port.
