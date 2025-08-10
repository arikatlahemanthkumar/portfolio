# Vercel Deployment Guide

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Git repository with your portfolio code

## Deployment Steps

### 1. Push Your Code to GitHub

Make sure your code is pushed to a GitHub repository.

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: npm run vercel-build
   - Output Directory: client/build

### Serverless Configuration

This project is configured to work with Vercel's serverless functions:

- `server.js` exports the Express app for Vercel and also works locally
- `api/index.js` serves as the serverless entry point
- `vercel.json` routes API requests to the serverless function

### 3. Environment Variables

Add the following environment variables in the Vercel project settings:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
JWT_SECRET=your_jwt_secret
```

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Troubleshooting Common Errors

### DEPLOYMENT_NOT_FOUND (Deployment404)
- Make sure your repository is correctly connected to Vercel
- Check that the build command is correctly set

### FUNCTION_INVOCATION_FAILED (Function500)
- Check your server.js file for errors
- Verify your MongoDB connection string is correct
- Make sure all environment variables are set correctly

### EDGE_FUNCTION_INVOCATION_FAILED (Function500)
- Check for syntax errors in your code
- Ensure all dependencies are correctly installed

### DEPLOYMENT_NOT_READY_REDIRECTING (Deployment303)
- The deployment is still in progress, wait for it to complete

### DEPLOYMENT_BLOCKED (Deployment403)
- Check if you've reached your plan limits
- Verify your account has the necessary permissions

## Verifying Deployment

After successful deployment, your site will be available at:
`https://your-project-name.vercel.app`

You can also set up a custom domain in the Vercel project settings.