FROM node:20-alpine

WORKDIR /app

COPY frontend/package*.json ./frontend/
COPY packages/shared/package*.json ./packages/shared/
RUN cd /app/frontend && npm ci --include=dev

COPY frontend ./frontend
COPY packages/shared ./packages/shared

WORKDIR /app/frontend

EXPOSE 5173

CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port 5173"]
