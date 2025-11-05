package smtp

import (
	"bufio"
	"crypto/tls"
	"fmt"
	"io"
	"log"
	"net"
	"net/mail"
	"strings"
	"time"

	"github.com/baliboy20/smtp_server_go/internal/config"
	"github.com/baliboy20/smtp_server_go/internal/models"
	"github.com/baliboy20/smtp_server_go/internal/storage"
	"github.com/baliboy20/smtp_server_go/pkg/utils"
)

// Server represents an SMTP server
type Server struct {
	config  *config.Config
	storage storage.Storage
	listener net.Listener
	webhooks []models.Webhook
}

// NewServer creates a new SMTP server
func NewServer(cfg *config.Config, store storage.Storage) *Server {
	return &Server{
		config:  cfg,
		storage: store,
		webhooks: make([]models.Webhook, 0),
	}
}

// Start starts the SMTP server
func (s *Server) Start() error {
	addr := fmt.Sprintf("%s:%s", s.config.SMTPHost, s.config.SMTPPort)

	var err error
	s.listener, err = net.Listen("tcp", addr)
	if err != nil {
		return fmt.Errorf("failed to start SMTP server: %w", err)
	}

	log.Printf("SMTP server listening on %s", addr)

	for {
		conn, err := s.listener.Accept()
		if err != nil {
			log.Printf("Failed to accept connection: %v", err)
			continue
		}

		go s.handleConnection(conn)
	}
}

// Stop stops the SMTP server
func (s *Server) Stop() error {
	if s.listener != nil {
		return s.listener.Close()
	}
	return nil
}

// AddWebhook adds a webhook for email notifications
func (s *Server) AddWebhook(webhook models.Webhook) {
	s.webhooks = append(s.webhooks, webhook)
}

func (s *Server) handleConnection(conn net.Conn) {
	defer conn.Close()

	session := &smtpSession{
		conn:    conn,
		server:  s,
		reader:  bufio.NewReader(conn),
		timeout: s.config.SMTPTimeout,
	}

	if err := session.handle(); err != nil {
		log.Printf("Session error: %v", err)
	}
}

type smtpSession struct {
	conn      net.Conn
	server    *Server
	reader    *bufio.Reader
	timeout   time.Duration
	from      string
	to        []string
	data      []byte
	authenticated bool
}

func (s *smtpSession) handle() error {
	// Set initial timeout
	s.conn.SetDeadline(time.Now().Add(s.timeout))

	// Send greeting
	if err := s.writeLine("220 SMTP Server Ready"); err != nil {
		return err
	}

	for {
		// Update timeout for each command
		s.conn.SetDeadline(time.Now().Add(s.timeout))

		line, err := s.reader.ReadString('\n')
		if err != nil {
			if err == io.EOF {
				return nil
			}
			return err
		}

		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		log.Printf("Client: %s", line)

		cmd := strings.ToUpper(strings.Split(line, " ")[0])

		switch cmd {
		case "HELO", "EHLO":
			if err := s.handleHelo(line); err != nil {
				return err
			}
		case "MAIL":
			if err := s.handleMail(line); err != nil {
				return err
			}
		case "RCPT":
			if err := s.handleRcpt(line); err != nil {
				return err
			}
		case "DATA":
			if err := s.handleData(); err != nil {
				return err
			}
		case "RSET":
			s.reset()
			if err := s.writeLine("250 OK"); err != nil {
				return err
			}
		case "NOOP":
			if err := s.writeLine("250 OK"); err != nil {
				return err
			}
		case "QUIT":
			s.writeLine("221 Bye")
			return nil
		case "AUTH":
			if err := s.handleAuth(line); err != nil {
				return err
			}
		case "STARTTLS":
			if err := s.handleStartTLS(); err != nil {
				return err
			}
		default:
			if err := s.writeLine("500 Command not recognized"); err != nil {
				return err
			}
		}
	}
}

func (s *smtpSession) handleHelo(line string) error {
	if strings.HasPrefix(strings.ToUpper(line), "EHLO") {
		// Extended SMTP
		if err := s.writeLine("250-Hello"); err != nil {
			return err
		}
		if s.server.config.EnableTLS {
			if err := s.writeLine("250-STARTTLS"); err != nil {
				return err
			}
		}
		if s.server.config.EnableAuth {
			if err := s.writeLine("250-AUTH PLAIN LOGIN"); err != nil {
				return err
			}
		}
		if err := s.writeLine("250 SIZE 10485760"); err != nil { // 10MB max
			return err
		}
	} else {
		if err := s.writeLine("250 Hello"); err != nil {
			return err
		}
	}
	return nil
}

func (s *smtpSession) handleMail(line string) error {
	// Parse MAIL FROM:<address>
	parts := strings.SplitN(line, ":", 2)
	if len(parts) < 2 {
		return s.writeLine("501 Syntax error in parameters")
	}

	from := strings.Trim(parts[1], " <>")
	s.from = from
	return s.writeLine("250 OK")
}

func (s *smtpSession) handleRcpt(line string) error {
	// Parse RCPT TO:<address>
	parts := strings.SplitN(line, ":", 2)
	if len(parts) < 2 {
		return s.writeLine("501 Syntax error in parameters")
	}

	to := strings.Trim(parts[1], " <>")
	s.to = append(s.to, to)
	return s.writeLine("250 OK")
}

func (s *smtpSession) handleData() error {
	if s.from == "" || len(s.to) == 0 {
		return s.writeLine("503 Bad sequence of commands")
	}

	if err := s.writeLine("354 Start mail input; end with <CRLF>.<CRLF>"); err != nil {
		return err
	}

	// Read email data
	data := make([]byte, 0)
	for {
		line, err := s.reader.ReadString('\n')
		if err != nil {
			return err
		}

		if line == ".\r\n" || line == ".\n" {
			break
		}

		data = append(data, []byte(line)...)
	}

	s.data = data

	// Parse and save email
	if err := s.saveEmail(); err != nil {
		log.Printf("Failed to save email: %v", err)
		return s.writeLine("554 Transaction failed")
	}

	s.reset()
	return s.writeLine("250 OK: Message accepted")
}

func (s *smtpSession) handleAuth(line string) error {
	if !s.server.config.EnableAuth {
		return s.writeLine("503 Authentication not enabled")
	}

	parts := strings.Fields(line)
	if len(parts) < 2 {
		return s.writeLine("501 Syntax error")
	}

	mechanism := strings.ToUpper(parts[1])

	switch mechanism {
	case "PLAIN":
		if err := s.writeLine("334 "); err != nil {
			return err
		}

		// Read authentication data
		_, err := s.reader.ReadString('\n')
		if err != nil {
			return err
		}

		// For simplicity, accept any authentication if configured
		// In production, properly validate credentials
		s.authenticated = true
		return s.writeLine("235 Authentication successful")

	case "LOGIN":
		if err := s.writeLine("334 VXNlcm5hbWU6"); err != nil { // "Username:" in base64
			return err
		}

		// Read username
		_, err := s.reader.ReadString('\n')
		if err != nil {
			return err
		}

		if err := s.writeLine("334 UGFzc3dvcmQ6"); err != nil { // "Password:" in base64
			return err
		}

		// Read password
		_, err = s.reader.ReadString('\n')
		if err != nil {
			return err
		}

		s.authenticated = true
		return s.writeLine("235 Authentication successful")

	default:
		return s.writeLine("504 Authentication mechanism not supported")
	}
}

func (s *smtpSession) handleStartTLS() error {
	if !s.server.config.EnableTLS || s.server.config.TLSCertFile == "" {
		return s.writeLine("454 TLS not available")
	}

	if err := s.writeLine("220 Ready to start TLS"); err != nil {
		return err
	}

	cert, err := tls.LoadX509KeyPair(s.server.config.TLSCertFile, s.server.config.TLSKeyFile)
	if err != nil {
		return err
	}

	tlsConn := tls.Server(s.conn, &tls.Config{
		Certificates: []tls.Certificate{cert},
	})

	if err := tlsConn.Handshake(); err != nil {
		return err
	}

	s.conn = tlsConn
	s.reader = bufio.NewReader(tlsConn)

	return nil
}

func (s *smtpSession) saveEmail() error {
	// Parse email
	msg, err := mail.ReadMessage(strings.NewReader(string(s.data)))
	if err != nil {
		log.Printf("Warning: Failed to parse email: %v", err)
		// Continue anyway with raw data
	}

	email := &models.Email{
		ID:         utils.GenerateID(),
		From:       s.from,
		To:         s.to,
		ReceivedAt: time.Now(),
		Size:       int64(len(s.data)),
		Headers:    make([]models.Header, 0),
	}

	if msg != nil {
		// Extract subject
		email.Subject = msg.Header.Get("Subject")

		// Extract all headers
		for key, values := range msg.Header {
			for _, value := range values {
				email.Headers = append(email.Headers, models.Header{
					Key:   key,
					Value: value,
				})
			}
		}

		// Read body
		body, err := io.ReadAll(msg.Body)
		if err == nil {
			email.Body = string(body)
		}
	} else {
		// Use raw data if parsing failed
		email.Body = string(s.data)
	}

	// Save to storage
	if err := s.server.storage.Save(email); err != nil {
		return err
	}

	log.Printf("Email saved: ID=%s, From=%s, To=%v, Subject=%s",
		email.ID, email.From, email.To, email.Subject)

	// Trigger webhooks
	go s.triggerWebhooks(email)

	return nil
}

func (s *smtpSession) triggerWebhooks(email *models.Email) {
	for _, webhook := range s.server.webhooks {
		if err := utils.TriggerWebhook(webhook, email); err != nil {
			log.Printf("Webhook failed: %v", err)
		}
	}
}

func (s *smtpSession) reset() {
	s.from = ""
	s.to = make([]string, 0)
	s.data = nil
}

func (s *smtpSession) writeLine(line string) error {
	log.Printf("Server: %s", line)
	_, err := s.conn.Write([]byte(line + "\r\n"))
	return err
}
