import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import configureDB from './config/db.js';
import contactRoutes from './routes/contact.js';
import projectRoutes from './routes/projects.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


(async () => {
  try {
    await configureDB();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
})();

const app = express();

app.use(express.json());
app.use(cors());

// API routes
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);



const buildPath = path.join(__dirname, "client", "build");

// Serve static files with proper caching headers
app.use(express.static(buildPath, {
  etag: true, // Enable ETag for caching
  lastModified: true, // Enable Last-Modified for caching
  setHeaders: (res, path) => {
    // Set caching headers based on file type
    if (path.endsWith('.html')) {
      // HTML files should not be cached aggressively
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (path.match(/\.(css|js)$/)) {
      // CSS and JS files can be cached but should revalidate
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (path.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
      // Images can be cached for longer periods
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

app.get('*', (req, res) => {
  // Skip API routes as they're handled by their own middleware
  if (req.path.startsWith('/api')) return;

  // Set appropriate headers for HTML content
  res.set({
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Content-Type': 'text/html; charset=utf-8'
  });
  
  // Send the index.html file for client-side routing
  res.sendFile(path.join(buildPath, "index.html"), {
    // Add error handling for sendFile
    error: (err) => {
      console.error('Error sending index.html:', err);
      res.status(500).send('Error loading the application. Please try again.');
    }
  });
});


const PORT = process.env.PORT || 5000;

if (process.env.VERCEL === undefined) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}


app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  if (req.path.startsWith('/api')) {
    return res.status(500).json({ error: 'Server error occurred' });
  }

  res.status(500).send('Server error occurred. Please try refreshing the page.');
});

export default app;