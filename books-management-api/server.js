require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const redisClient = require('./services/redisClient');
const errorHandler = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');

// Route imports
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Cron Jobs
require('./cron/bulkInsertJob');
require('./cron/reportSenderJob');

// App initialization
const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/report', reportRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('📚 Books API with Redis Caching and Cron Jobs is running!');
});

// Error Handling Middleware
app.use(errorHandler);

// Server + Redis start
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await redisClient.connect();
    logger.info(' Redis connected');
  } catch (err) {
    logger.error(' Redis connection failed: %s', err.message);
  }

  logger.info(` Server is running on http://localhost:${PORT}`);
});
