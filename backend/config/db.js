const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (uri && uri !== 'your_mongodb_atlas_connection_string') {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 }); // Fast fail if not running
      console.log('MongoDB Connected to Atlas/Local');
      return;
    } else {
      throw new Error('No valid MONGO_URI');
    }
  } catch (err) {
    console.log('--- 🚀 INDUSTRY LEVEL MOCK MODE ACTIVATED 🚀 ---');
    console.log('Proceeding with In-Memory store for users and videos.');
    console.log('Starting in-memory MongoDB server... This may take a moment.');
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('In-Memory MongoDB Connected successfully!');
      console.log('-----------------------------------------------');
    } catch (mockErr) {
      console.error('Failed to start in-memory mock MongoDB:', mockErr);
    }
  }
};

module.exports = connectDB;
