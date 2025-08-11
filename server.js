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

// DB connection
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

// Static path
const buildPath = path.join(__dirname, 'client', 'build');

// Serve static files
app.use(express.static(buildPath, {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, must-revalidate');
    } else if (filePath.match(/\.(css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Explicit MIME fixes
app.get('/static/css/:file', (req, res, next) => {
  res.type('text/css');
  next();
});
app.get('/static/js/:file', (req, res, next) => {
  res.type('application/javascript');
  next();
});
app.get('/serviceWorker.js', (req, res, next) => {
  res.type('application/javascript');
  res.set('Cache-Control', 'no-store');
  next();
});
app.get('/preload.js', (req, res, next) => {
  res.type('application/javascript');
  res.set('Cache-Control', 'no-store');
  next();
});

// Client routing fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return;
  res.sendFile(path.join(buildPath, 'index.html'), err => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading app.');
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (req.path.startsWith('/api')) {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.redirect('/fallback.html');
  }
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
