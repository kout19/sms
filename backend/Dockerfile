FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
COPY packages/shared/package*.json ./packages/shared/
RUN cd /app/backend && npm ci --include=dev

COPY backend ./backend
COPY packages/shared ./packages/shared

WORKDIR /app/backend
RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run dev"]
