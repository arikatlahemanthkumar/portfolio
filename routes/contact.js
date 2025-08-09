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
    res.status(500).json({ msg: 'Server Error' });
  }
});


router.post('/', [
  body('name', 'Name is required').not().isEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('subject', 'Subject is required').not().isEmpty().trim(),
  body('message', 'Message is required').not().isEmpty().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      msg: 'Validation failed', 
      errors: errors.array() 
    });
  }

  const { name, email, subject, message } = req.body;

  try {
   
    const contact = new Contact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    await contact.save();
    console.log('Contact saved to database successfully');

    // Send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log('Setting up email transporter...');
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          tls: {
            rejectUnauthorized: false
          }
        });

    
        await transporter.verify();
        console.log('Email transporter verified successfully');

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                New Contact Message
              </h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              <div style="background: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
                <h4>Message:</h4>
                <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <hr style="margin: 30px 0;">
              <p style="color: #666; font-size: 14px;">
                This message was sent from your portfolio contact form.
              </p>
            </div>
          `,
      
          text: `
New Contact Message

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from your portfolio contact form.
          `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        
        res.json({ 
          msg: 'Thank you! Your message has been sent successfully.',
          success: true
        });

      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        console.error('Email error details:', emailError);
        
        // Still return success since the message was saved to database
        res.json({ 
          msg: 'Your message has been saved. We will get back to you soon!',
          success: true,
          emailWarning: 'Email notification could not be sent'
        });
      }
    } else {
      console.log('Email credentials not configured');
      res.json({ 
        msg: 'Your message has been saved successfully!',
        success: true
      });
    }

  } catch (err) {
    console.error('Database error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ 
      msg: 'Something went wrong. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;