package models

import (
	"time"
)

// Email represents a received email message
type Email struct {
	ID          string       `json:"id"`
	From        string       `json:"from"`
	To          []string     `json:"to"`
	Subject     string       `json:"subject"`
	Body        string       `json:"body"`
	HTML        string       `json:"html,omitempty"`
	Headers     []Header     `json:"headers"`
	Attachments []Attachment `json:"attachments,omitempty"`
	ReceivedAt  time.Time    `json:"received_at"`
	Size        int64        `json:"size"`
}

// Header represents an email header
type Header struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// Attachment represents an email attachment
type Attachment struct {
	Filename    string `json:"filename"`
	ContentType string `json:"content_type"`
	Size        int64  `json:"size"`
	Data        []byte `json:"data,omitempty"`
}

// Stats represents server statistics
type Stats struct {
	TotalEmails   int       `json:"total_emails"`
	TotalSize     int64     `json:"total_size_bytes"`
	LastEmailAt   time.Time `json:"last_email_at,omitempty"`
	ServerStarted time.Time `json:"server_started"`
}

// Webhook represents webhook configuration
type Webhook struct {
	URL    string            `json:"url"`
	Method string            `json:"method"`
	Headers map[string]string `json:"headers,omitempty"`
}

// OutboundEmail represents an email to be sent
type OutboundEmail struct {
	From    string            `json:"from,omitempty"`
	To      []string          `json:"to"`
	Cc      []string          `json:"cc,omitempty"`
	Bcc     []string          `json:"bcc,omitempty"`
	Subject string            `json:"subject"`
	Body    string            `json:"body,omitempty"`
	HTML    string            `json:"html,omitempty"`
	Headers map[string]string `json:"headers,omitempty"`
}
