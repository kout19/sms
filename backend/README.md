# Backend

This backend uses Node.js, Express, and PostgreSQL with a shared pg pool.

## Environment

Set these variables in `backend/.env` for local development or in the container environment:

- DATABASE_URL
- ACCESS_TOKEN_SECRET
- REFRESH_TOKEN_SECRET
- CLIENT_URL

## Start

npm install
npm run db:generate
npm run dev

## Prisma schema and migrations

After changing `prisma/schema.prisma`, regenerate the Prisma Client with `npm run db:generate` before starting the backend. Apply committed additive migrations to the configured database with `npm run db:migrate:deploy`. The Prisma CLI and application use the same `DATABASE_URL`; do not use database-reset commands against Neon.
