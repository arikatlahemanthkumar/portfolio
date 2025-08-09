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
├── client/                 # React Frontend
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # React components
│       └── index.js       # App entry point
├── config/
│   └── db.js             # Database configuration
├── models/               # MongoDB schemas
├── routes/               # API routes
├── server.js             # Express server
└── package.json          # Backend dependencies
```

## 🎯 Features
- ✅ Responsive design
- ✅ Contact form with email notifications
- ✅ Project showcase
- ✅ Skills section with progress bars
- ✅ Experience timeline
- ✅ Modern animations
- ✅ SEO optimized

## 📧 Contact Form Setup
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

4. If you're still having issues with Gmail authentication:
   - Make sure Less Secure App access is turned off (it's deprecated)
   - Check if your Google Account has any security restrictions
   - Try using a different email service if Gmail continues to cause problems

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

