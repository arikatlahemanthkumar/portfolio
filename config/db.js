import mongoose from 'mongoose';

const configureDB = async () => {
  try {
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📚 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('🔍 MONGODB_URI:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'NOT SET');
    console.error('💡 Please check your MONGODB_URI environment variable');
    process.exit(1);
  }
};

export default configureDB;
