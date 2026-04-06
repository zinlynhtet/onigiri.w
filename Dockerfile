# Build stage
FROM golang:1.26.1-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o flickk-node .

# Production stage
FROM alpine:latest

WORKDIR /app

# Copy binary and static files
COPY --from=builder /app/flickk-node .
COPY --from=builder /app/static ./static

# Expose the API port
EXPOSE 8080

# Keep data persistent by mounting a volume at /app
VOLUME ["/app/blockchain.json"]

CMD ["./flickk-node"]
