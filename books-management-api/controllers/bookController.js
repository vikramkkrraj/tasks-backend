const Book = require('../models/Book');
const redisClient = require('../services/redisClient');

const getRedisKey = (userId) => `books:user:${userId}`;

exports.getBooks = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const redisKey = getRedisKey(userId);

    // Try getting from Redis cache
    const cached = await redisClient.get(redisKey);
    if(cached) {
      console.log('Cache hit');
      return res.json(JSON.parse(cached));
    }

    console.log('Cache miss');
    const books = await Book.find({ userId });
    await redisClient.set(redisKey, JSON.stringify(books), { EX: 120 }); // 2 mins expiry

    res.json(books);
  } catch(err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const invalidateCache = async (userId) => {
  const redisKey = getRedisKey(userId);
  await redisClient.del(redisKey);
}

exports.addBook = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { title, author, description } = req.body;

    const book = new Book({ userId, title, author, description });
    await book.save();

    await invalidateCache(userId);

    res.status(201).json(book);
  } catch(err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

exports.updateBook = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { id } = req.params;
    const { title, author, description } = req.body;

    const book = await Book.findOneAndUpdate(
      { _id: id, userId },
      { title, author, description },
      { new: true }
    );
    if(!book) return res.status(404).json({ message: 'Book not found' });

    await invalidateCache(userId);

    res.json(book);
  } catch(err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

exports.deleteBook = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { id } = req.params;

    const book = await Book.findOneAndDelete({ _id: id, userId });
    if(!book) return res.status(404).json({ message: 'Book not found' });

    await invalidateCache(userId);

    res.json({ message: 'Book deleted' });
  } catch(err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
