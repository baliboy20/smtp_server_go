#!/usr/bin/env python3
"""
Example: Send email to SMTP server using Python
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

def send_email(smtp_host='localhost', smtp_port=2525):
    """Send a test email to the SMTP server"""

    # Create message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Test Email from Python'
    msg['From'] = 'sender@example.com'
    msg['To'] = 'recipient@example.com'

    # Plain text version
    text = "This is a test email sent from Python!"
    part1 = MIMEText(text, 'plain')

    # HTML version
    html = """\
    <html>
      <head></head>
      <body>
        <h1>Test Email</h1>
        <p>This is a <strong>test email</strong> sent from Python!</p>
      </body>
    </html>
    """
    part2 = MIMEText(html, 'html')

    # Attach parts
    msg.attach(part1)
    msg.attach(part2)

    try:
        # Connect and send
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            print(f"Connecting to {smtp_host}:{smtp_port}...")
            server.send_message(msg)
            print("Email sent successfully!")

    except Exception as e:
        print(f"Error sending email: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    send_email()
