const cron = require('node-cron');
const redisClient = require('./redisClient');
const Book = require('../models/Book');

async function processBulkBooks() {
  try {
    // Find all keys matching bulk books pattern
    const keys = await redisClient.keys('books:bulk:user:*');

    if (!keys.length) {
      console.log('No bulk books to process');
      return;
    }

    for (const key of keys) {
      const userId = key.split(':')[3];
      console.log(`Processing bulk books for user ${userId}`);

      // Fetch all stored book JSON strings
      const bulkBooks = await redisClient.lRange(key, 0, -1);
      if (!bulkBooks.length) continue;

      // Parse JSON strings to book objects and attach userId
      const booksToInsert = bulkBooks.map(bookStr => {
        const book = JSON.parse(bookStr);
        return { ...book, userId };
      });

      // Bulk insert into MongoDB
      await Book.insertMany(booksToInsert);

      // Delete processed bulk books key
      await redisClient.del(key);

      console.log(`Inserted ${booksToInsert.length} books for user ${userId} and cleared Redis list`);

      // Invalidate cache for this user
      const userCacheKey = `books:user:${userId}`;
      await redisClient.del(userCacheKey);
      console.log(`Cache invalidated for user ${userId}`);
    }
  } catch (err) {
    console.error('Error processing bulk books:', err);
  }
}

// Schedule cron to run every 2 minutes
function startCron() {
  cron.schedule('*/2 * * * *', () => {
    console.log('Running bulk books cron job...');
    processBulkBooks();
  });
}

module.exports = startCron;
