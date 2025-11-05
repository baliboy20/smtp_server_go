#!/usr/bin/env node
/**
 * Example: Send email to SMTP server using Node.js
 *
 * Install: npm install nodemailer
 */

const nodemailer = require('nodemailer');

async function sendEmail() {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 2525,
    secure: false, // true for 465, false for other ports
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Send email
    const info = await transporter.sendMail({
      from: '"Test Sender" <sender@example.com>',
      to: 'recipient@example.com',
      subject: 'Test Email from Node.js',
      text: 'This is a test email sent from Node.js!',
      html: '<h1>Test Email</h1><p>This is a <strong>test email</strong> sent from Node.js!</p>'
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);

  } catch (error) {
    console.error('Error sending email:', error);
    process.exit(1);
  }
}

sendEmail();
