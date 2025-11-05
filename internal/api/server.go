package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"golang.org/x/time/rate"

	"github.com/baliboy20/smtp_server_go/internal/config"
	"github.com/baliboy20/smtp_server_go/internal/models"
	"github.com/baliboy20/smtp_server_go/internal/smtp"
	"github.com/baliboy20/smtp_server_go/internal/storage"
)

// Server represents the API server
type Server struct {
	config      *config.Config
	storage     storage.Storage
	smtpServer  *smtp.Server
	smtpClient  *smtp.Client
	router      *mux.Router
	rateLimiter *rate.Limiter
}

// NewServer creates a new API server
func NewServer(cfg *config.Config, store storage.Storage, smtpServer *smtp.Server) *Server {
	s := &Server{
		config:      cfg,
		storage:     store,
		smtpServer:  smtpServer,
		smtpClient:  smtp.NewClient(cfg),
		router:      mux.NewRouter(),
		rateLimiter: rate.NewLimiter(rate.Limit(cfg.RateLimit), cfg.RateLimit*2),
	}

	s.setupRoutes()
	return s
}

func (s *Server) setupRoutes() {
	// API routes
	api := s.router.PathPrefix("/api").Subrouter()

	// Middleware
	api.Use(s.rateLimitMiddleware)
	if s.config.APIKey != "" {
		api.Use(s.authMiddleware)
	}

	// Email endpoints
	api.HandleFunc("/emails", s.listEmails).Methods("GET")
	api.HandleFunc("/emails/{id}", s.getEmail).Methods("GET")
	api.HandleFunc("/emails/{id}", s.deleteEmail).Methods("DELETE")
	api.HandleFunc("/emails", s.clearEmails).Methods("DELETE")

	// Send email endpoint
	api.HandleFunc("/send", s.sendEmail).Methods("POST")

	// Stats endpoint
	api.HandleFunc("/stats", s.getStats).Methods("GET")

	// Webhook endpoint
	api.HandleFunc("/webhooks", s.addWebhook).Methods("POST")

	// Health check (no auth required)
	s.router.HandleFunc("/health", s.healthCheck).Methods("GET")
	s.router.HandleFunc("/api/health", s.healthCheck).Methods("GET")
}

// Start starts the API server
func (s *Server) Start() error {
	addr := fmt.Sprintf("%s:%s", s.config.APIHost, s.config.APIPort)

	var handler http.Handler = s.router
	if s.config.EnableCORS {
		c := cors.New(cors.Options{
			AllowedOrigins:   []string{"*"},
			AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowedHeaders:   []string{"*"},
			AllowCredentials: true,
		})
		handler = c.Handler(s.router)
	}

	log.Printf("API server listening on %s", addr)
	return http.ListenAndServe(addr, handler)
}

// Middleware

func (s *Server) rateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !s.rateLimiter.Allow() {
			s.respondError(w, http.StatusTooManyRequests, "Rate limit exceeded")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKey := r.Header.Get("X-API-Key")
		if apiKey != s.config.APIKey {
			s.respondError(w, http.StatusUnauthorized, "Invalid API key")
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Handlers

func (s *Server) listEmails(w http.ResponseWriter, r *http.Request) {
	emails, err := s.storage.List()
	if err != nil {
		s.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	s.respondJSON(w, http.StatusOK, map[string]interface{}{
		"emails": emails,
		"count":  len(emails),
	})
}

func (s *Server) getEmail(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	email, err := s.storage.Get(id)
	if err != nil {
		s.respondError(w, http.StatusNotFound, "Email not found")
		return
	}

	s.respondJSON(w, http.StatusOK, email)
}

func (s *Server) deleteEmail(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := s.storage.Delete(id); err != nil {
		s.respondError(w, http.StatusNotFound, "Email not found")
		return
	}

	s.respondJSON(w, http.StatusOK, map[string]string{
		"message": "Email deleted successfully",
	})
}

func (s *Server) clearEmails(w http.ResponseWriter, r *http.Request) {
	if err := s.storage.Clear(); err != nil {
		s.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	s.respondJSON(w, http.StatusOK, map[string]string{
		"message": "All emails cleared successfully",
	})
}

func (s *Server) getStats(w http.ResponseWriter, r *http.Request) {
	stats := s.storage.Stats()
	s.respondJSON(w, http.StatusOK, stats)
}

func (s *Server) addWebhook(w http.ResponseWriter, r *http.Request) {
	var webhook models.Webhook
	if err := json.NewDecoder(r.Body).Decode(&webhook); err != nil {
		s.respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if webhook.URL == "" {
		s.respondError(w, http.StatusBadRequest, "Webhook URL is required")
		return
	}

	s.smtpServer.AddWebhook(webhook)

	s.respondJSON(w, http.StatusOK, map[string]string{
		"message": "Webhook added successfully",
	})
}

func (s *Server) sendEmail(w http.ResponseWriter, r *http.Request) {
	var email models.OutboundEmail
	if err := json.NewDecoder(r.Body).Decode(&email); err != nil {
		s.respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate required fields
	if len(email.To) == 0 {
		s.respondError(w, http.StatusBadRequest, "At least one recipient is required")
		return
	}

	if email.Subject == "" {
		s.respondError(w, http.StatusBadRequest, "Subject is required")
		return
	}

	if email.Body == "" && email.HTML == "" {
		s.respondError(w, http.StatusBadRequest, "Either body or html is required")
		return
	}

	// Send the email
	if err := s.smtpClient.SendEmail(&email); err != nil {
		log.Printf("Failed to send email: %v", err)
		s.respondError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to send email: %v", err))
		return
	}

	s.respondJSON(w, http.StatusOK, map[string]string{
		"message": "Email sent successfully",
	})
}

func (s *Server) healthCheck(w http.ResponseWriter, r *http.Request) {
	stats := s.storage.Stats()

	health := map[string]interface{}{
		"status":         "healthy",
		"timestamp":      time.Now().Format(time.RFC3339),
		"uptime_seconds": time.Since(s.config.ServerStarted).Seconds(),
		"storage":        s.config.StorageType,
		"smtp_port":      s.config.SMTPPort,
		"api_port":       s.config.APIPort,
		"total_emails":   stats.TotalEmails,
	}

	s.respondJSON(w, http.StatusOK, health)
}

// Helper functions

func (s *Server) respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func (s *Server) respondError(w http.ResponseWriter, status int, message string) {
	s.respondJSON(w, status, map[string]string{
		"error": message,
	})
}
