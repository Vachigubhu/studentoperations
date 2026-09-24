FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

ENV CI=true

COPY . .

RUN pnpm install --frozen-lockfile

ARG VITE_API_URL=http://localhost:5000/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm --filter web build


FROM nginx:alpine AS runner

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]