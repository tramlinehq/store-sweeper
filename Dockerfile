FROM node:18-alpine AS builder

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src ./src
COPY nodemon.json ./

RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/nodemon.json ./

RUN touch .env

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8081/healthz || exit 1

CMD ["node", "dist/app.cjs"]
