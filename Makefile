.PHONY: build run clean test deps help

# Default target
.DEFAULT_GOAL := help

# Build the application
build: ## Build the SMTP server binary
	@echo "Building SMTP server..."
	@go build -o smtp_server_go ./cmd/server

# Run the application
run: ## Run the SMTP server
	@echo "Starting SMTP server..."
	@go run ./cmd/server/main.go

# Install dependencies
deps: ## Download dependencies
	@echo "Downloading dependencies..."
	@go mod download
	@go mod tidy

# Run tests
test: ## Run tests
	@echo "Running tests..."
	@go test -v ./...

# Clean build artifacts
clean: ## Remove build artifacts
	@echo "Cleaning..."
	@rm -f smtp_server_go
	@rm -f emails.json

# Format code
fmt: ## Format Go code
	@echo "Formatting code..."
	@go fmt ./...

# Run linter
lint: ## Run Go linter
	@echo "Running linter..."
	@golangci-lint run

# Development mode with auto-reload
dev: ## Run in development mode
	@which air > /dev/null || go install github.com/cosmtrek/air@latest
	@air

# Docker build
docker-build: ## Build Docker image
	@docker build -t smtp-server-go .

# Docker run
docker-run: ## Run Docker container
	@docker run -p 2525:2525 -p 8080:8080 smtp-server-go

# Help target
help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)
