// test-connection.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    const database = client.db('chatapp');
    const collection = database.collection('transcripts');
    
    // Test insert
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Connection test successful'
    };
    
    const result = await collection.insertOne(testDoc);
    console.log('✅ Test document inserted:', result.insertedId);
    
    // Clean up test document
    await collection.deleteOne({ _id: result.insertedId });
    console.log('✅ Test document cleaned up');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
  }
}

testConnection();