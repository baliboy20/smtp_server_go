# SMTP Server in Go

A modern, API-driven SMTP server built with Go. Perfect for development, testing, and email capture scenarios.

## Features

### Core SMTP Features
- **RFC 5321 Compliant** - Full SMTP protocol implementation
- **Email Reception** - Receive emails via standard SMTP protocol
- **MIME Parsing** - Parse multipart emails and attachments
- **TLS/STARTTLS Support** - Secure email transmission
- **SMTP Authentication** - AUTH PLAIN and LOGIN mechanisms
- **Configurable Timeout** - Prevent connection hangs

### REST API Features
- **Email Management** - List, retrieve, and delete emails via REST API
- **Statistics** - Server stats including email count and storage size
- **Webhook Support** - Real-time notifications for new emails
- **Health Check** - Monitor server status
- **CORS Support** - Easy integration with web applications
- **Rate Limiting** - Prevent API abuse
- **API Key Authentication** - Secure your API endpoints

### Storage Options
- **In-Memory Storage** - Fast, ephemeral storage (default)
- **File Storage** - Persistent JSON-based storage
- **Extensible** - Easy to add database backends

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/baliboy20/smtp_server_go.git
cd smtp_server_go

# Install dependencies
go mod download

# Run the server
go run cmd/server/main.go
```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t smtp-server-go .
docker run -p 2525:2525 -p 8080:8080 smtp-server-go
```

### Using Make

```bash
make deps    # Install dependencies
make build   # Build binary
make run     # Run server
make help    # Show all commands
```

## Configuration

Configuration is done via environment variables. Copy `.env.example` to `.env` and customize:

```bash
# SMTP Server
SMTP_HOST=0.0.0.0        # SMTP bind address
SMTP_PORT=2525           # SMTP port (use 25, 587, or 2525)
SMTP_TIMEOUT=30s         # Connection timeout

# API Server
API_HOST=0.0.0.0         # API bind address
API_PORT=8080            # API port

# Security
ENABLE_TLS=false         # Enable TLS for SMTP
TLS_CERT_FILE=           # Path to TLS certificate
TLS_KEY_FILE=            # Path to TLS private key
API_KEY=                 # API authentication key (optional)
SMTP_USERNAME=           # SMTP auth username (optional)
SMTP_PASSWORD=           # SMTP auth password (optional)

# Storage
STORAGE_TYPE=memory      # "memory" or "file"
STORAGE_FILE=emails.json # File path for file storage
MAX_EMAILS=1000          # Maximum emails to store

# Features
ENABLE_AUTH=false        # Require SMTP authentication
ENABLE_CORS=true         # Enable CORS for API
RATE_LIMIT=100          # API requests per minute
```

## API Documentation

Base URL: `http://localhost:8080/api`

### Authentication

If `API_KEY` is set, include it in requests:

```bash
curl -H "X-API-Key: your-api-key" http://localhost:8080/api/emails
```

### Endpoints

#### List All Emails
```bash
GET /api/emails
```

Response:
```json
{
  "emails": [
    {
      "id": "abc123...",
      "from": "sender@example.com",
      "to": ["recipient@example.com"],
      "subject": "Test Email",
      "body": "Email content...",
      "html": "",
      "headers": [
        {"key": "Content-Type", "value": "text/plain"}
      ],
      "attachments": [],
      "received_at": "2025-11-05T10:30:00Z",
      "size": 1234
    }
  ],
  "count": 1
}
```

#### Get Single Email
```bash
GET /api/emails/{id}
```

Response: Single email object

#### Delete Email
```bash
DELETE /api/emails/{id}
```

Response:
```json
{
  "message": "Email deleted successfully"
}
```

#### Clear All Emails
```bash
DELETE /api/emails
```

Response:
```json
{
  "message": "All emails cleared successfully"
}
```

#### Get Server Statistics
```bash
GET /api/stats
```

Response:
```json
{
  "total_emails": 42,
  "total_size_bytes": 125678,
  "last_email_at": "2025-11-05T10:30:00Z",
  "server_started": "2025-11-05T08:00:00Z"
}
```

#### Add Webhook
```bash
POST /api/webhooks
```

Request body:
```json
{
  "url": "https://your-app.com/webhook",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer token"
  }
}
```

#### Health Check
```bash
GET /health
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-05T10:30:00Z",
  "uptime_seconds": 3600,
  "storage": "memory",
  "smtp_port": "2525",
  "api_port": "8080",
  "total_emails": 42
}
```

## Usage Examples

### Sending Email via SMTP

#### Using Python
```python
import smtplib
from email.mime.text import MIMEText

msg = MIMEText('This is a test email')
msg['Subject'] = 'Test Email'
msg['From'] = 'sender@example.com'
msg['To'] = 'recipient@example.com'

with smtplib.SMTP('localhost', 2525) as server:
    server.send_message(msg)
```

#### Using curl (SMTP protocol)
```bash
curl smtp://localhost:2525 \
  --mail-from sender@example.com \
  --mail-rcpt recipient@example.com \
  --upload-file email.txt
```

#### Using Node.js (nodemailer)
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 2525,
  secure: false
});

await transporter.sendMail({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email'
});
```

### Retrieving Emails via API

#### List all emails
```bash
curl http://localhost:8080/api/emails
```

#### Get specific email
```bash
curl http://localhost:8080/api/emails/abc123...
```

#### Delete email
```bash
curl -X DELETE http://localhost:8080/api/emails/abc123...
```

#### Clear all emails
```bash
curl -X DELETE http://localhost:8080/api/emails
```

### Webhooks

Register a webhook to receive notifications when emails arrive:

```bash
curl -X POST http://localhost:8080/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhook",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer your-token"
    }
  }'
```

Your webhook will receive POST requests with the email data:
```json
{
  "id": "abc123...",
  "from": "sender@example.com",
  "to": ["recipient@example.com"],
  "subject": "Test Email",
  "body": "Email content...",
  "received_at": "2025-11-05T10:30:00Z"
}
```

## Use Cases

### Development Testing
Test email functionality in your applications without sending real emails:
```bash
# Start the server
go run cmd/server/main.go

# Configure your app to use localhost:2525
# Check received emails via API
curl http://localhost:8080/api/emails
```

### CI/CD Email Testing
Integrate into your test suite:
```bash
# Start server in background
./smtp_server_go &

# Run your tests
npm test

# Verify emails were sent
curl http://localhost:8080/api/emails | jq '.count'
```

### Email Capture Service
Capture and inspect emails for QA or debugging:
```bash
# Enable file persistence
export STORAGE_TYPE=file
export STORAGE_FILE=captured_emails.json
./smtp_server_go
```

## Architecture

```
smtp_server_go/
├── cmd/
│   └── server/          # Application entry point
├── internal/
│   ├── api/            # REST API server
│   ├── smtp/           # SMTP server implementation
│   ├── models/         # Data models
│   ├── storage/        # Storage implementations
│   └── config/         # Configuration management
└── pkg/
    └── utils/          # Utility functions
```

## Data Models

### Email
```go
type Email struct {
    ID          string       // Unique identifier
    From        string       // Sender address
    To          []string     // Recipient addresses
    Subject     string       // Email subject
    Body        string       // Plain text body
    HTML        string       // HTML body (optional)
    Headers     []Header     // Email headers
    Attachments []Attachment // Attachments (optional)
    ReceivedAt  time.Time    // Reception timestamp
    Size        int64        // Email size in bytes
}
```

### Header
```go
type Header struct {
    Key   string  // Header name
    Value string  // Header value
}
```

### Attachment
```go
type Attachment struct {
    Filename    string  // File name
    ContentType string  // MIME type
    Size        int64   // File size
    Data        []byte  // File data
}
```

## Security Considerations

1. **Network Exposure**: By default, the server binds to `0.0.0.0`. In production, consider binding to `localhost` or using a firewall.

2. **API Authentication**: Set `API_KEY` environment variable to require authentication for API requests.

3. **SMTP Authentication**: Enable `ENABLE_AUTH=true` and set `SMTP_USERNAME` and `SMTP_PASSWORD` to require authentication for SMTP connections.

4. **TLS Encryption**: Enable TLS for secure communication:
   ```bash
   ENABLE_TLS=true
   TLS_CERT_FILE=/path/to/cert.pem
   TLS_KEY_FILE=/path/to/key.pem
   ```

5. **Rate Limiting**: Adjust `RATE_LIMIT` to prevent abuse.

## Performance

- **In-Memory Storage**: Handles thousands of emails with minimal overhead
- **Rate Limiting**: Configurable per-minute request limits
- **Concurrent Connections**: Handles multiple SMTP connections simultaneously
- **Max Emails**: Automatically removes oldest emails when limit is reached

## Development

### Running Tests
```bash
make test
```

### Code Formatting
```bash
make fmt
```

### Building
```bash
make build
```

### Development Mode (with auto-reload)
```bash
make dev
```

## Troubleshooting

### SMTP Connection Issues
- Check if port 2525 is available: `netstat -an | grep 2525`
- Verify firewall rules allow connections
- Check logs for connection errors

### API Not Responding
- Verify API server started: `curl http://localhost:8080/health`
- Check if port 8080 is available
- Review API key configuration

### Emails Not Saving
- Check storage configuration in logs
- For file storage, verify write permissions
- Check `MAX_EMAILS` limit

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/baliboy20/smtp_server_go/issues
- Documentation: This README

## Roadmap

Future enhancements:
- [ ] Database storage backends (PostgreSQL, MongoDB, Redis)
- [ ] SMTP relay/forwarding capability
- [ ] Advanced email filtering and routing
- [ ] Web UI for email viewing
- [ ] Email search functionality
- [ ] Attachment extraction and serving
- [ ] SMTP DKIM/SPF verification
- [ ] Multiple mailbox support
- [ ] GraphQL API
- [ ] Metrics and monitoring (Prometheus)
- [ ] Advanced webhook filtering
