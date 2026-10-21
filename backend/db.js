const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = 'mongodb://localhost:27017/lab_borrow_db';
    
    await mongoose.connect(MONGO_URI);
    
    console.log('✅ Connected to MongoDB (lab_borrow_db)');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1); 
  }
};

module.exports = connectDB;