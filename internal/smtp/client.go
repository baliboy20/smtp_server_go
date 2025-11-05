package smtp

import (
	"fmt"
	"log"

	"github.com/baliboy20/smtp_server_go/internal/config"
	"github.com/baliboy20/smtp_server_go/internal/models"
	"github.com/wneessen/go-mail"
)

// Client represents an SMTP client for sending emails
type Client struct {
	config *config.Config
}

// NewClient creates a new SMTP client
func NewClient(cfg *config.Config) *Client {
	return &Client{
		config: cfg,
	}
}

// SendEmail sends an email using the configured SMTP relay (Gmail)
func (c *Client) SendEmail(email *models.OutboundEmail) error {
	// Validate configuration
	if c.config.OutboundSMTPUsername == "" || c.config.OutboundSMTPPassword == "" {
		return fmt.Errorf("outbound SMTP credentials not configured")
	}

	// Create new message
	m := mail.NewMsg()

	// Set From address
	fromAddr := email.From
	if fromAddr == "" {
		fromAddr = c.config.OutboundSMTPFrom
	}
	if fromAddr == "" {
		fromAddr = c.config.OutboundSMTPUsername
	}

	if err := m.From(fromAddr); err != nil {
		return fmt.Errorf("failed to set From address: %w", err)
	}

	// Set To addresses
	if len(email.To) == 0 {
		return fmt.Errorf("no recipients specified")
	}
	if err := m.To(email.To...); err != nil {
		return fmt.Errorf("failed to set To addresses: %w", err)
	}

	// Set Cc addresses if provided
	if len(email.Cc) > 0 {
		if err := m.Cc(email.Cc...); err != nil {
			return fmt.Errorf("failed to set Cc addresses: %w", err)
		}
	}

	// Set Bcc addresses if provided
	if len(email.Bcc) > 0 {
		if err := m.Bcc(email.Bcc...); err != nil {
			return fmt.Errorf("failed to set Bcc addresses: %w", err)
		}
	}

	// Set subject
	m.Subject(email.Subject)

	// Set body (HTML or plain text)
	if email.HTML != "" {
		m.SetBodyString(mail.TypeTextHTML, email.HTML)
		if email.Body != "" {
			m.AddAlternativeString(mail.TypeTextPlain, email.Body)
		}
	} else if email.Body != "" {
		m.SetBodyString(mail.TypeTextPlain, email.Body)
	}

	// Add custom headers if provided
	// Note: go-mail v0.7.2 doesn't support arbitrary custom headers easily
	// Custom headers can be added in future versions or by using different methods
	_ = email.Headers // Suppress unused variable warning

	// Create SMTP client
	client, err := mail.NewClient(
		c.config.OutboundSMTPHost,
		mail.WithPort(c.config.OutboundSMTPPort),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(c.config.OutboundSMTPUsername),
		mail.WithPassword(c.config.OutboundSMTPPassword),
		mail.WithTLSPortPolicy(mail.TLSMandatory),
	)
	if err != nil {
		return fmt.Errorf("failed to create SMTP client: %w", err)
	}

	// Send the email
	if err := client.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	log.Printf("Email sent successfully: From=%s, To=%v, Subject=%s",
		fromAddr, email.To, email.Subject)

	return nil
}
