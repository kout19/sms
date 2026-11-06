# SMS Project Master Plan

Last audited: 2026-11-06. This document describes the product and the order of work. It does not mark a feature complete unless the frontend, API, and database workflow have been verified together.

## Product vision

SMS is a commercial, multi-tenant School Management System for administrators, teachers, students, parents, and finance staff. It is one modular application, not a separate backend per role.

The product must remain expandable to more schools and more workflows without a rewrite. AI, payments, email, SMS, and file storage are future integration points. They are not part of the current implementation.

## Technology constraints

Keep the existing stack unless a change is explicitly approved:

- Frontend: React, Vite, JSX, Tailwind CSS, React Router, Redux Toolkit, TanStack Query, Axios.
- Backend: Node.js, Express, JavaScript, Prisma, PostgreSQL, REST under `/api/v1`.
- Auth: short-lived JWT access tokens in memory, HTTP-only refresh cookies, server-side revocation.
- Runtime: Docker Compose, environment-based configuration.

## Major modules

| Module              | Purpose                                         | Depends on                          |
| ------------------- | ----------------------------------------------- | ----------------------------------- |
| Identity and access | Login, refresh, logout, roles, permissions      | User, School                        |
| Tenant and school   | One database, school-scoped records             | School                              |
| Academic structure  | Years, departments, classes, sections, subjects | School                              |
| People              | Students, teachers, parents, accountants        | Academic structure, User            |
| Academic operations | Attendance, assignments, exams, grades          | People, classes, subjects           |
| Communication       | Announcements, messages, notifications          | People                              |
| Finance             | Fees, invoices, payments, receipts              | Students, parents                   |
| Insights            | Dashboards, reports                             | The records those screens summarize |
| Platform admin      | Schools and cross-tenant operations             | Stable tenant model                 |

## Phases

### Phase 1 — Foundation

Authentication exists and is usable, with security gaps listed in `DEVELOPMENT_STATUS.md`. School, User, role enum, shared permissions, tenant middleware, and a Class model exist. User-management APIs are not mounted. School management APIs do not exist.

### Phase 2 — Academic structure

`Class` is the only academic table. Grade, section, and academic year are columns on `Class`, not their own tables. Departments, subjects, and a real academic-year entity are missing. Admin screens for classes, departments, and subjects are mock UI.

### Phase 3 — People

Students and teachers have mounted APIs and admin screens wired to those APIs. Both are incomplete and, for students, inconsistent with the current Prisma schema. Parents, accountants, and settings user-management are mock UI. There is no parent-to-student relationship.

### Phase 4 — Academic operations

Attendance, exams, assignments, and grades have admin or role UI shells and empty or unmounted backend files. No attendance or grade tables exist.

### Phase 5 — Communication

Announcements and messages are in-memory mock APIs. No notification delivery.

### Phase 6 — Management

Settings, reports, and finance screens are mock data. No fee, invoice, or payment models.

### Phase 7 — Dashboard and analytics

The admin overview endpoint returns three live user counts plus hardcoded class, performance, fee, and activity values. Charts on the dashboard are static. Other role dashboards are mock layouts.

Do not treat the dashboard as the next build target. It should summarize records that already exist.

## Performance and public pages

Authenticated screens must load with server-side pagination, selective queries, and indexes. Public pages (landing and login) need real document titles, descriptions, and a fast first load. SEO work belongs on public routes. Private dashboards should stay out of search indexes.

## Long-term integrations

Design seams, do not build them yet:

- AI: a separate provider adapter. No student data leaves the system until a data-handling design is approved. Permissions and tenant scope apply before any model call.
- Payments: provider-independent invoices and payment records. Never store raw card data. Verify webhooks and ignore duplicate events.
- Files, email, SMS, and push: provider adapters behind school-scoped services.

## Working rule

Finish one vertical slice before starting the next. A slice includes schema alignment, validation, permissions, tenant scope, API contract, admin UI, and a verified workflow. Remove mock data only for the slice that is actually connected.
