package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/baliboy20/smtp_server_go/internal/api"
	"github.com/baliboy20/smtp_server_go/internal/config"
	"github.com/baliboy20/smtp_server_go/internal/smtp"
	"github.com/baliboy20/smtp_server_go/internal/storage"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	log.Println("Starting SMTP Server...")

	// Load configuration
	cfg := config.LoadConfig()

	// Initialize storage
	var store storage.Storage
	var err error

	if cfg.StorageType == "file" {
		store, err = storage.NewFileStorage(cfg.StorageFile, cfg.MaxEmails, cfg.ServerStarted)
		if err != nil {
			log.Fatalf("Failed to initialize file storage: %v", err)
		}
		log.Printf("Using file storage: %s", cfg.StorageFile)
	} else {
		store = storage.NewMemoryStorage(cfg.MaxEmails, cfg.ServerStarted)
		log.Println("Using in-memory storage")
	}

	// Initialize SMTP server
	smtpServer := smtp.NewServer(cfg, store)

	// Initialize API server
	apiServer := api.NewServer(cfg, store, smtpServer)

	// Start SMTP server in goroutine
	go func() {
		if err := smtpServer.Start(); err != nil {
			log.Fatalf("SMTP server error: %v", err)
		}
	}()

	// Start API server in goroutine
	go func() {
		if err := apiServer.Start(); err != nil {
			log.Fatalf("API server error: %v", err)
		}
	}()

	log.Println("Server started successfully!")
	log.Printf("SMTP Server: %s:%s", cfg.SMTPHost, cfg.SMTPPort)
	log.Printf("API Server: http://%s:%s", cfg.APIHost, cfg.APIPort)
	log.Printf("Health Check: http://%s:%s/health", cfg.APIHost, cfg.APIPort)

	// Wait for interrupt signal to gracefully shut down
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	smtpServer.Stop()
	log.Println("Server stopped")
}
