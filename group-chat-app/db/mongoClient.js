const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
async function saveToMongo(messages) {
  try {
    await client.connect();
    const db = client.db('chat');
    const collection = db.collection('backups');
    await collection.insertMany(messages);
    console.log('💾 Backup saved to MongoDB');
  } catch (err) {
    console.error('Mongo error:', err);
  }
}
module.exports = { saveToMongo };
