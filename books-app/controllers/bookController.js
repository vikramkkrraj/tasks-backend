const Book = require('../models/Book');
const redisClient = require('../utils/redisClient');

const getUserCacheKey = (userId) => `books:user:${userId}`;

exports.getBooks = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cacheKey = getUserCacheKey(userId);
    const cachedBooks = await redisClient.get(cacheKey);

    if (cachedBooks) {
      console.log('Serving books from Redis cache');
      return res.json(JSON.parse(cachedBooks));
    }

    console.log('Cache miss. Fetching books from DB');
    const books = await Book.find({ userId });
    await redisClient.set(cacheKey, JSON.stringify(books), { EX: 120 }); // 2 min TTL

    res.json(books);
  } catch (err) {
    console.error('Get books error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const invalidateUserCache = async (userId) => {
  const cacheKey = getUserCacheKey(userId);
  await redisClient.del(cacheKey);
  console.log(`Cache invalidated for user ${userId}`);
};

exports.addBook = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, author, publishedYear } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const newBook = new Book({ userId, title, author, publishedYear });
    await newBook.save();

    await invalidateUserCache(userId);

    res.status(201).json(newBook);
  } catch (err) {
    console.error('Add book error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookId = req.params.id;
    const updates = req.body;

    const book = await Book.findOne({ _id: bookId, userId });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    Object.assign(book, updates);
    await book.save();

    await invalidateUserCache(userId);

    res.json(book);
  } catch (err) {
    console.error('Update book error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookId = req.params.id;

    const deleted = await Book.findOneAndDelete({ _id: bookId, userId });
    if (!deleted) return res.status(404).json({ message: 'Book not found' });

    await invalidateUserCache(userId);

    res.json({ message: 'Book deleted' });
  } catch (err) {
    console.error('Delete book error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk insert handler
exports.bulkInsertBooks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const books = req.body.books;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: 'Books array is required' });
    }

    // Store the books array in Redis list for this user (push to Redis list)
    const redisKey = `books:bulk:user:${userId}`;
    // Store as JSON string per book
    const pipeline = redisClient.multi();
    books.forEach(book => {
      pipeline.rPush(redisKey, JSON.stringify(book));
    });
    // Set expiration for bulk key 1 hour (optional)
    pipeline.expire(redisKey, 3600);
    await pipeline.exec();

    res.json({ message: 'Books will be added later' });
  } catch (err) {
    console.error('Bulk insert error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
