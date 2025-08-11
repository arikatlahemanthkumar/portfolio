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

// Initialize database connection
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

// Serve frontend - only for non-API routes and only when not matched by Vercel's static file routing
// This ensures HTML5 history API works for client-side routing
app.get('*', (req, res) => {
  // Skip API routes as they're handled by specific middleware
  if (req.path.startsWith('/api')) return;
  
  // Set cache control headers for HTML
  res.set({
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  // Send the React app's index.html for client-side routing
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// For both local development and Vercel serverless functions
const PORT = process.env.PORT || 5000;

// Only start the server if not running on Vercel
if (process.env.VERCEL === undefined) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Check if the request is for an API endpoint
  if (req.path.startsWith('/api')) {
    return res.status(500).json({ error: 'Server error occurred' });
  }
  
  // For non-API requests, send a basic error message
  res.status(500).send('Server error occurred. Please try refreshing the page.');
});

// Export for Vercel serverless functions
export default app;