#!/bin/bash
#
# Example: Test SMTP server using netcat/telnet
#

SMTP_HOST="localhost"
SMTP_PORT="2525"

echo "Testing SMTP server at $SMTP_HOST:$SMTP_PORT"
echo

# Create email content
cat > /tmp/test_email.txt << 'EOF'
EHLO localhost
MAIL FROM:<sender@example.com>
RCPT TO:<recipient@example.com>
DATA
Subject: Test Email via Shell
From: sender@example.com
To: recipient@example.com

This is a test email sent via shell script!
.
QUIT
EOF

echo "Sending email via SMTP..."
echo

# Send via netcat
nc $SMTP_HOST $SMTP_PORT < /tmp/test_email.txt

echo
echo "Email sent! Check API for received email:"
echo "  curl http://localhost:8080/api/emails | jq"

# Cleanup
rm /tmp/test_email.txt
