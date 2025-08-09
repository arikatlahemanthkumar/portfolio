import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.new file
dotenv.config({ path: path.join(__dirname, '.env.new') });

// Debug: Print environment variables
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'is set' : 'is not set');

// OAuth2 configuration
// You need to set these environment variables in your .env.new file:
// CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !process.env.EMAIL_USER) {
  console.error('Error: CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, and EMAIL_USER must be set in .env.new file');
  console.log('Please follow these steps to set up OAuth2 for Gmail:');
  console.log('1. Go to https://console.developers.google.com and create a project');
  console.log('2. Enable the Gmail API for your project');
  console.log('3. Create OAuth credentials (Web Application type)');
  console.log('4. Add https://developers.google.com/oauthplayground as an authorized redirect URI');
  console.log('5. Go to https://developers.google.com/oauthplayground');
  console.log('6. Click the gear icon and check "Use your own OAuth credentials"');
  console.log('7. Enter your Client ID and Client Secret');
  console.log('8. Select Gmail API v1 and authorize with scope https://mail.google.com/');
  console.log('9. Exchange the authorization code for tokens');
  console.log('10. Add the following to your .env.new file:');
  console.log('   CLIENT_ID=your_client_id');
  console.log('   CLIENT_SECRET=your_client_secret');
  console.log('   REFRESH_TOKEN=your_refresh_token');
  process.exit(1);
}

async function sendMail() {
  try {
    // Create OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    // Set credentials
    oAuth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN
    });

    // Get access token
    const accessToken = await oAuth2Client.getAccessToken();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });

    // Test email options
    const mailOptions = {
      from: `Portfolio Contact <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sending to yourself for testing
      subject: 'Portfolio Contact Form Test',
      html: `
        <h3>Test Email</h3>
        <p>This is a test email to verify that your portfolio contact form is working correctly.</p>
        <p><strong>If you received this email, your OAuth2 email configuration is working!</strong></p>
        <p>You can now deploy your portfolio with confidence that the contact form will send emails.</p>
      `
    };

    // Verify connection
    console.log('Verifying email configuration...');
    await transporter.verify();
    console.log('Email configuration verified successfully!');
    
    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Error details:', error);
  }
}

// Execute the function
sendMail();