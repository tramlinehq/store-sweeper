FROM golang:1.23-alpine AS builder

RUN apk add --no-cache git make build-base

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download -x || (go env && go mod download -v && exit 1)

COPY . .

RUN touch .env

RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/.env .
COPY --from=builder /app/config ./config

RUN adduser -D sweeperUser
USER sweeperUser

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8081/healthz || exit 1

EXPOSE 8081

CMD ["./main"]
