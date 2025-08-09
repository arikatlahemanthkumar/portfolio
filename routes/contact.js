import express from 'express';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import Contact from '../models/Contact.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('subject', 'Subject is required').not().isEmpty(),
  body('message', 'Message is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;

  try {
    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();

    // Check if we have email credentials
    if (process.env.EMAIL_USER) {
      try {
        let transporter;
        
        // Check if we have OAuth2 credentials
        if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.REFRESH_TOKEN) {
          // Use OAuth2 for Gmail (more secure)
          const { google } = await import('googleapis');
          
          // Create OAuth2 client
          const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
          );

          // Set credentials
          oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
          });

          // Get access token
          const accessToken = await oAuth2Client.getAccessToken();

          // Create transporter with OAuth2
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.EMAIL_USER,
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refreshToken: process.env.REFRESH_TOKEN,
              accessToken: accessToken.token
            }
          });
          console.log('Using OAuth2 method for email');
        } else if (process.env.EMAIL_PASS) {
          // Fallback to app password method
          console.log('Using app password method for email');
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS // App password (no spaces)
            },
            tls: {
              rejectUnauthorized: false
            }
          });
        } else {
          console.log('No email authentication method available');
          throw new Error('No email authentication method available');
        }

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <h3>New Contact Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        console.error('Email error details:', emailError);
        // Still return success to the client since we saved to database
        // In production, you might want to log this to a monitoring service
      }
    }

    res.json({ msg: 'Message sent successfully!' });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;