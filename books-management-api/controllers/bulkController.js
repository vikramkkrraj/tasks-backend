const redisClient = require('../services/redisClient');

const BULK_BOOKS_KEY = (userId) => `bulkBooks:user:${userId}`;
const BULK_STATUS_KEY = (userId) => `bulkStatus:user:${userId}`;

exports.bulkInsert = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const books = req.body.books;

    if(!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: 'Books array is required' });
    }

    // Store bulk books array in Redis (append or overwrite)
    await redisClient.set(BULK_BOOKS_KEY(userId), JSON.stringify(books));

    res.json({ message: 'Books will be added later' });
  } catch(err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { BULK_BOOKS_KEY, BULK_STATUS_KEY };
