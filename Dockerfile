# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o smtp_server_go ./cmd/server

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/smtp_server_go .

# Copy .env.example as default config
COPY --from=builder /app/.env.example .env.example

# Expose ports
EXPOSE 2525 8080

# Run the application
CMD ["./smtp_server_go"]
