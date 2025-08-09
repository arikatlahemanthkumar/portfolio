import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to .env file
const envPath = path.join(__dirname, '.env.new');

// Check if .env file exists
console.log(`Checking if .env file exists at: ${envPath}`);
console.log(`File exists: ${fs.existsSync(envPath)}`);

// If file exists, print its contents
if (fs.existsSync(envPath)) {
  console.log('Contents of .env file:');
  console.log(fs.readFileSync(envPath, 'utf8'));
}

// Load environment variables
console.log('Loading environment variables...');
dotenv.config({ path: envPath });

// Print all environment variables
console.log('\nEnvironment variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);