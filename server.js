// server.js - Add at the very top
require('dotenv').config();

console.log('🔍 Environment check:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI starts with:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'NOT FOUND');

// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001; // Hard-coded since env vars aren't working

// Add error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);

// Health check FIRST (before routes that might crash)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Try to load transcript routes with error handling
try {
  console.log('📁 Loading transcript routes...');
  const transcriptRoutes = require('./src/routes/transcript');
  app.use('/api/transcript', transcriptRoutes);
  console.log('✅ Transcript routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load transcript routes:', error.message);
  console.error('Stack:', error.stack);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('🚀 Server started successfully');
});

// Keep the process alive and log if it's about to exit
process.on('exit', (code) => {
  console.log(`💀 Process exiting with code: ${code}`);
});