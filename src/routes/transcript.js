// routes/transcript.js
const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

// MongoDB Atlas connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority';

// Database and collection names
const DATABASE_NAME = 'chatapp'; // Replace with your database name
const COLLECTION_NAME = 'transcripts';

// Create a single MongoDB client instance
let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI, {
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  }
  return client.db(DATABASE_NAME);
}

// POST endpoint to save feedback
router.post('/feedback', async (req, res) => {
  try {
    // Connect to database
    const database = await connectToDatabase();
    const collection = database.collection('feedback'); // New collection for feedback
    
    // Prepare feedback data with additional metadata
    const feedbackData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };
    
    // Insert the feedback into MongoDB
    const result = await collection.insertOne(feedbackData);
    
    // Log successful save
    console.log('Feedback saved:', {
      insertedId: result.insertedId,
      feedbackId: feedbackData.feedbackId || 'no-id',
      rating: feedbackData.rating || 'no-rating'
    });
    
    // Return success response
    res.status(201).json({
      success: true,
      insertedId: result.insertedId,
      feedbackId: feedbackData.feedbackId,
      message: 'Feedback saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save feedback',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST endpoint to save transcript
router.post('/save', async (req, res) => {
  try {
    // Connect to database
    const database = await connectToDatabase();
    const collection = database.collection(COLLECTION_NAME);
    
    // Prepare transcript data with additional metadata
    const transcriptData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };
    
    // Insert the transcript into MongoDB
    const result = await collection.insertOne(transcriptData);
    
    // Log successful save
    console.log('Transcript saved:', {
      insertedId: result.insertedId,
      sessionId: transcriptData.sessionId,
      messageCount: transcriptData.messageCount,
      exitMethod: transcriptData.exitMethod
    });
    
    // Return success response
    res.status(201).json({
      success: true,
      insertedId: result.insertedId,
      sessionId: transcriptData.sessionId,
      message: 'Transcript saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving transcript:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save transcript',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET endpoint to retrieve transcripts (optional - for debugging/admin purposes)
router.get('/list', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection(COLLECTION_NAME);
    
    // Get query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Query transcripts with pagination
    const transcripts = await collection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination info
    const totalCount = await collection.countDocuments({});
    
    res.json({
      success: true,
      transcripts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error retrieving transcripts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve transcripts'
    });
  }
});

// GET endpoint to retrieve a specific transcript by ID
router.get('/:id', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection(COLLECTION_NAME);
    
    const { ObjectId } = require('mongodb');
    const transcriptId = new ObjectId(req.params.id);
    
    const transcript = await collection.findOne({ _id: transcriptId });
    
    if (!transcript) {
      return res.status(404).json({
        success: false,
        error: 'Transcript not found'
      });
    }
    
    res.json({
      success: true,
      transcript
    });
    
  } catch (error) {
    console.error('Error retrieving transcript:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve transcript'
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed.');
  }
  process.exit(0);
});

module.exports = router;