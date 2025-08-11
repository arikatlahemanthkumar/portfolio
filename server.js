import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import configureDB from './config/db.js';
import contactRoutes from './routes/contact.js';
import projectRoutes from './routes/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// DB connection with improved error handling for serverless environments
let dbConnectionPromise;

const connectToDB = async () => {
  try {
    if (!dbConnectionPromise) {
      dbConnectionPromise = configureDB();
    }
    await dbConnectionPromise;
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    // Don't exit process in serverless environment
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    return false;
  }
};

// Initialize DB connection
connectToDB();

const app = express();
app.use(express.json());
app.use(cors());

// Simplified middleware - let routes handle their own DB connection errors
const dbConnectionMiddleware = async (req, res, next) => {
  // Skip DB connection check for warmup requests
  if (req.headers['x-warmup-request'] === 'true') {
    return res.status(200).json({ status: 'ok', message: 'Warmup request received' });
  }

  // Don't block requests - let individual routes handle DB errors
  next();
};

// Apply the middleware to API routes
app.use('/api/contact', dbConnectionMiddleware, contactRoutes);
app.use('/api/projects', dbConnectionMiddleware, projectRoutes);

// Special warmup endpoint for Vercel cold starts
app.get('/api/warmup', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is ready' });
});

// Health check endpoint for monitoring and reliability
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const dbConnected = await connectToDB();
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100,
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
      external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100,
    };
    
    // Check uptime
    const uptime = process.uptime();
    
    // Determine overall status
    const status = dbConnected ? 'healthy' : 'degraded';
    
    res.status(dbConnected ? 200 : 503).json({
      status,
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: dbConnected
      },
      memory: memoryUsageMB,
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
});

// Static path
const buildPath = path.join(__dirname, 'client', 'build');

// Serve static files
app.use(express.static(buildPath, {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (filePath.match(/\.(css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.endsWith('fallback.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Explicit MIME fixes
app.get('/static/css/:file', (req, res, next) => {
  res.type('text/css');
  next();
});
app.get('/static/js/:file', (req, res, next) => {
  res.type('application/javascript; charset=UTF-8');
  next();
});
app.get('/serviceWorker.js', (req, res, next) => {
  res.type('application/javascript; charset=UTF-8');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Determine if this is an API request
  const isApiRequest = req.originalUrl.startsWith('/api/');
  
  if (isApiRequest) {
    // For API requests, return JSON error
    const statusCode = err.statusCode || 500;
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
      error: true,
      message: errorMessage,
      code: err.code || 'INTERNAL_SERVER_ERROR',
      // Only include stack trace in development
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
  } else {
    // For non-API requests, redirect to fallback page with error info
    const errorType = 'server';
    const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
    const redirectUrl = `/fallback.html?type=${errorType}&code=${errorCode}&t=${Date.now()}`;
    
    res.redirect(redirectUrl);
  }
});
// Preload.js route handler moved above with proper MIME type and cache headers

// This health check endpoint is now redundant since we have a more comprehensive one above
// Keeping it for backward compatibility
app.get('/api/health-legacy', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV, vercel: !!process.env.VERCEL });
});

// Client routing fallback with improved error handling
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api')) return;
  
  // Add headers to prevent caching issues
  res.set({
    'Cache-Control': 'no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Content-Type-Options': 'nosniff'
  });
  
  // Send the index.html file
  res.sendFile(path.join(buildPath, 'index.html'), err => {
    if (err) {
      console.error('Error serving index.html:', err);
      // Send a more user-friendly error page
      res.status(500).sendFile(path.join(buildPath, 'fallback.html'));
    }
  });
});

// 404 handler for API routes that weren't matched
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested API endpoint '${req.originalUrl}' does not exist.`,
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
