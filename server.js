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

// Serve frontend
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// For both local development and Vercel serverless functions
const PORT = process.env.PORT || 5000;

// Only start the server if not running on Vercel
if (process.env.VERCEL === undefined) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless functions
export default app;