# 🚀 Hemanth Kumar Arikatla - Portfolio

Full Stack Developer Portfolio built with MERN Stack

## 🌟 Live Demo
[Your Portfolio URL will be here after deployment]

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB
- **Deployment**: Railway/Render
- **Email**: Nodemailer with Gmail

## 🚀 Quick Deploy

### Railway (Recommended)
1. Fork this repository
2. Go to [Railway](https://railway.app)
3. Connect your GitHub account
4. Deploy from GitHub repo
5. Add environment variables (see DEPLOYMENT.md)
6. Your portfolio will be live in 5 minutes!

## 📁 Project Structure
```
portfolio/
├── api/                   # Vercel serverless entry point
│   └── index.js          # Serverless function entry
├── client/                # React Frontend
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # React components
│       └── index.js      # App entry point
├── config/
│   └── db.js            # Database configuration with connection pooling
├── models/              # MongoDB schemas
├── routes/              # API routes
├── server.js            # Express server (works both locally and on Vercel)
├── vercel.json          # Vercel deployment configuration
└── package.json         # Backend dependencies
```

## 🌐 Serverless Architecture

This portfolio is designed to work both locally and as a serverless application on Vercel:

- **Local Development**: Run with `node server.js` for a traditional Express server
- **Vercel Deployment**: Automatically runs as serverless functions
- **Database Connection**: Optimized with connection pooling for serverless environments
- **API Routes**: Seamlessly work in both environments

## 🎯 Features
- ✅ Responsive design
- ✅ Contact form with email notifications
- ✅ Project showcase
- ✅ Skills section with progress bars
- ✅ Experience timeline
- ✅ Modern animations
- ✅ SEO optimized

## 📧 Contact Form Setup

You have two options for setting up the contact form email functionality:

### Option 1: Gmail App Password (Simpler but less secure)

1. Enable 2FA on your Gmail account:
   - Go to your Google Account > Security
   - Under "Signing in to Google," select 2-Step Verification > Get started
   - Follow the steps to turn on 2-Step Verification

2. Generate an App Password:
   - Go to your Google Account > Security
   - Under "Signing in to Google," select App passwords (requires 2-Step Verification)
   - Select "Mail" as the app and "Other" as the device
   - Enter a name (e.g., "Portfolio Contact Form")
   - Click "Generate"
   - Copy the 16-character password (spaces will be removed automatically)

3. Add to environment variables:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### Option 2: OAuth2 Authentication (More secure, recommended)

1. Go to the [Google Developer Console](https://console.developers.google.com)
2. Create a new project
3. Enable the Gmail API for your project
4. Create OAuth credentials (Web Application type)
5. Add `https://developers.google.com/oauthplayground` as an authorized redirect URI
6. Save your Client ID and Client Secret
7. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
8. Click the gear icon and check "Use your own OAuth credentials"
9. Enter your Client ID and Client Secret
10. Select Gmail API v1 and authorize with scope `https://mail.google.com/`
11. Exchange the authorization code for tokens
12. Add these values to your environment variables:
    ```
    EMAIL_USER=your-email@gmail.com
    CLIENT_ID=your-client-id
    CLIENT_SECRET=your-client-secret
    REFRESH_TOKEN=your-refresh-token
    ```

### Troubleshooting Email Issues

- Make sure Less Secure App access is turned off
- Check if your Google Account has any security restrictions
- Verify that all credentials are entered correctly
- Try using a different email service if Gmail continues to cause problems
- See DEPLOYMENT.md for more detailed instructions

## 🗄️ Database Setup
1. Create MongoDB Atlas account
2. Create free cluster
3. Get connection string
4. Add to environment variables:
   ```
   MONGODB_URI=your-mongodb-atlas-uri
   ```

## 🚀 Local Development
```bash
# Install dependencies
npm install
cd client && npm install

# Run development servers
npm run dev
```


## 📞 Contact
- Email: arikatlahemanthkumar@gmail.com
- LinkedIn: https://www.linkedin.com/in/arikatla-hemanth-kumar-0b3693213/
- GitHub: https://github.com/arikatlahemanthkumar
- Phone: +91 9492906798

