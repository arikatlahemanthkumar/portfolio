# 🚀 Portfolio Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended - Free)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your portfolio repository
5. Add environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_uri
   EMAIL_USER=hemantharikatla03@gmail.com
   EMAIL_PASS=suuv qtbt mtct btln
   JWT_SECRET=your_secret_key
   ```
6. Deploy! Your site will be live at `https://your-app-name.railway.app`

### Option 2: Render (Free)
1. Go to [render.com](https://render.com)
2. Sign up and connect GitHub
3. Click "New" → "Web Service"
4. Select your repository
5. Configure:
   - **Build Command**: `npm install && cd client && npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables (same as above)
7. Deploy!

### Option 3: Heroku (Paid)
1. Install Heroku CLI
2. Run: `heroku create your-portfolio-name`
3. Add MongoDB Atlas addon
4. Set environment variables
5. Deploy: `git push heroku main`

## Environment Variables Setup

### MongoDB Atlas (Free Database)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Replace `your_mongodb_atlas_uri` with your connection string

### Gmail App Password Setup
1. Enable 2-factor authentication on your Gmail account:
   - Go to your Google Account > Security
   - Under "Signing in to Google," select 2-Step Verification > Get started
   - Follow the steps to turn on 2-Step Verification

2. Generate an App Password:
   - Go to your Google Account > Security
   - Under "Signing in to Google," select App passwords (requires 2-Step Verification)
   - Select "Mail" as the app and "Other" as the device
   - Enter a name (e.g., "Portfolio Contact Form")
   - Click "Generate"
   - Copy the 16-character password (remove spaces)

3. Use that password in `EMAIL_PASS` environment variable

4. Important: If you're still having issues with Gmail authentication:
   - Make sure Less Secure App access is turned off (it's deprecated)
   - Check if your Google Account has any security restrictions
   - Try using a different email service if Gmail continues to cause problems

## Local Testing Before Deploy

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Build frontend
cd client && npm run build && cd ..

# Test production build
NODE_ENV=production npm start
```

## Post-Deployment Checklist

✅ [ ] Test contact form sends emails  
✅ [ ] Test all pages load correctly  
✅ [ ] Test responsive design on mobile  
✅ [ ] Update resume with live URL  
✅ [ ] Share with recruiters!  

## Custom Domain (Optional)
1. Buy domain from Namecheap/GoDaddy
2. Add CNAME record pointing to your deployment URL
3. Configure in your hosting platform

## Performance Tips
- Images are optimized in `/client/public/`
- React build is minified
- Database queries are optimized
- Email notifications work reliably

Your portfolio will be live and ready to impress recruiters! 🎯
