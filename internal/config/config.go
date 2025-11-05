package config

import (
	"os"
	"strconv"
	"time"
)

// Config holds all application configuration
type Config struct {
	// SMTP Server
	SMTPHost     string
	SMTPPort     string
	SMTPTimeout  time.Duration

	// API Server
	APIHost      string
	APIPort      string

	// Security
	EnableTLS    bool
	TLSCertFile  string
	TLSKeyFile   string
	APIKey       string
	SMTPUsername string
	SMTPPassword string

	// Storage
	StorageType  string // "memory" or "file"
	StorageFile  string
	MaxEmails    int

	// Features
	EnableAuth   bool
	EnableCORS   bool
	RateLimit    int // requests per minute

	// Server
	ServerStarted time.Time
}

// LoadConfig loads configuration from environment variables with defaults
func LoadConfig() *Config {
	return &Config{
		SMTPHost:      getEnv("SMTP_HOST", "0.0.0.0"),
		SMTPPort:      getEnv("SMTP_PORT", "2525"),
		SMTPTimeout:   getDurationEnv("SMTP_TIMEOUT", 30*time.Second),

		APIHost:       getEnv("API_HOST", "0.0.0.0"),
		APIPort:       getEnv("API_PORT", "8080"),

		EnableTLS:     getBoolEnv("ENABLE_TLS", false),
		TLSCertFile:   getEnv("TLS_CERT_FILE", ""),
		TLSKeyFile:    getEnv("TLS_KEY_FILE", ""),
		APIKey:        getEnv("API_KEY", ""),
		SMTPUsername:  getEnv("SMTP_USERNAME", ""),
		SMTPPassword:  getEnv("SMTP_PASSWORD", ""),

		StorageType:   getEnv("STORAGE_TYPE", "memory"),
		StorageFile:   getEnv("STORAGE_FILE", "emails.json"),
		MaxEmails:     getIntEnv("MAX_EMAILS", 1000),

		EnableAuth:    getBoolEnv("ENABLE_AUTH", false),
		EnableCORS:    getBoolEnv("ENABLE_CORS", true),
		RateLimit:     getIntEnv("RATE_LIMIT", 100),

		ServerStarted: time.Now(),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getIntEnv(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getBoolEnv(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolVal, err := strconv.ParseBool(value); err == nil {
			return boolVal
		}
	}
	return defaultValue
}

func getDurationEnv(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}
