# GitHub Deployment Guide

## Prerequisites
- Git installed on your machine
- GitHub account
- Portfolio project ready for deployment

## Steps to Deploy to GitHub

### 1. Initialize Git Repository (if not already done)
```bash
git init
```

### 2. Add All Files to Git
```bash
git add .
```

### 3. Commit Changes
```bash
git commit -m "Initial commit of portfolio project"
```

### 4. Create a New Repository on GitHub
- Go to [GitHub](https://github.com/)
- Click on the '+' icon in the top right corner and select 'New repository'
- Name your repository (e.g., 'portfolio')
- Choose public or private visibility
- Do not initialize with README, .gitignore, or license
- Click 'Create repository'

### 5. Connect Local Repository to GitHub
```bash
git remote add origin https://github.com/yourusername/portfolio.git
```
Replace 'yourusername' with your GitHub username and 'portfolio' with your repository name.

### 6. Push to GitHub
```bash
git push -u origin main
```
If your default branch is 'master' instead of 'main', use:
```bash
git push -u origin master
```

## Updating Your Repository

After making changes to your project, follow these steps to update your GitHub repository:

### 1. Check Status
```bash
git status
```

### 2. Add Changes
```bash
git add .
```

### 3. Commit Changes
```bash
git commit -m "Description of changes"
```

### 4. Push Changes
```bash
git push
```

## Important Notes

### Sensitive Information
- Make sure your `.env` file is included in `.gitignore` to prevent pushing sensitive information
- Never commit API keys, passwords, or other sensitive data

### Large Files
- GitHub has a file size limit of 100MB
- For larger files, consider using Git LFS or hosting them elsewhere

### Deployment
After pushing to GitHub, you can deploy your application using services mentioned in DEPLOYMENT.md:
- Railway
- Render
- Heroku

These services can be connected directly to your GitHub repository for automatic deployments when you push changes.