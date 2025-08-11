#!/usr/bin/env node

/**
 * Simple deployment script for the portfolio
 * This script builds the React app and deploys to Vercel
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting portfolio deployment...');

try {
  // Build the React app
  console.log('📦 Building React application...');
  execSync('npm run build', { 
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit' 
  });
  
  console.log('✅ Build completed successfully!');
  
  // Deploy to Vercel
  console.log('🌐 Deploying to Vercel...');
  execSync('vercel --prod', { 
    cwd: __dirname,
    stdio: 'inherit' 
  });
  
  console.log('🎉 Deployment completed successfully!');
  console.log('Your portfolio is now live and optimized for fast loading!');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
