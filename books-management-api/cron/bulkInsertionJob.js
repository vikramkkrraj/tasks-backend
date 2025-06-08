const cron = require('cron');
const redisClient = require('../services/redisClient');
const Book = require('../models/Book');

const { BULK_BOOKS_KEY, BULK_STATUS_KEY } = require('../controllers/bulkController');

const bulkInsertionJob = new cron.CronJob('*/2 * * * *', async () => {
  try {
    console.log('Running bulk insertion job');

    // Get all keys matching bulk books pattern
    const keys = await redisClient.keys('bulkBooks:user:*');

    for(const key of keys) {
      const userId = key.split(':')[2];
      const rawBooks = await redisClient.get(key);
      if(!rawBooks) continue;

      const books = JSON.parse(rawBooks);
      let successCount = 0, failCount = 0;

      for(const book of books) {
        try {
          await Book.create({ userId, ...book });
          successCount++;
        } catch (err) {
          failCount++;
          console.error(`Failed to insert book for user ${userId}:`, err.message);
        }
      }

      // Save status in Redis
      const status = {
        userId,
        successCount,
        failCount,
        timestamp: Date.now(),
      };
      await redisClient.set(BULK_STATUS_KEY(userId), JSON.stringify(status));

      // Remove bulk books key after processing
      await redisClient.del(key);

      // Invalidate user cache for books after insertion
      await redisClient.del(`books:user:${userId}`);
    }
  } catch(err) {
    console.error('Bulk insertion job error:', err);
  }
});

module.exports = { bulkInsertionJob };
