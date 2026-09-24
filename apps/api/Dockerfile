FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

ENV CI=true

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter api build


FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

WORKDIR /app/apps/api

EXPOSE 5000

CMD ["node", "dist/server.js"]