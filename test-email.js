import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if email credentials are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Error: EMAIL_USER and EMAIL_PASS must be set in .env file');
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // App password (no spaces)
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test email options
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // Sending to yourself for testing
  subject: 'Portfolio Contact Form Test',
  html: `
    <h3>Test Email</h3>
    <p>This is a test email to verify that your portfolio contact form is working correctly.</p>
    <p><strong>If you received this email, your email configuration is working!</strong></p>
    <p>You can now deploy your portfolio with confidence that the contact form will send emails.</p>
  `
};

// Verify connection
console.log('Verifying email configuration...');
transporter.verify()
  .then(() => {
    console.log('Email configuration verified successfully!');
    
    // Send test email
    console.log('Sending test email...');
    return transporter.sendMail(mailOptions);
  })
  .then(info => {
    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('\nYour email configuration is working correctly!');
  })
  .catch(error => {
    console.error('Error:', error.message);
    console.error('\nEmail configuration failed. Please check your .env file and make sure:');
    console.error('1. EMAIL_USER is set to your Gmail address');
    console.error('2. EMAIL_PASS is set to your Gmail app password (with no spaces)');
    console.error('3. You have followed the steps in README.md to set up 2FA and generate an app password');
    console.error('\nFull error details:', error);
  });