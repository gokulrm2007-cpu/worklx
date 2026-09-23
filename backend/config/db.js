const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    isConnected = false;
    return;
  }

  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/worklx';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[WORKLX MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[WORKLX MongoDB] Warning: Could not connect to MongoDB (${error.message}).`);
    console.warn(`[WORKLX MongoDB] Running in mock/memory fallback mode with seed data.`);
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  database: isConnected ? mongoose.connection.name : 'worklx-memory-fallback',
  host: isConnected ? mongoose.connection.host : 'local-memory',
});

module.exports = { connectDB, getDBStatus };
