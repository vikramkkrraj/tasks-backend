import express from 'express';
import mongoose from 'mongoose';
import movieRoutes from './routes/movieRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();
app.use(express.json());

app.use('/movies', movieRoutes);
app.use('/users', userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/analytics', analyticsRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/moviedb').then(() => {
  app.listen(3000, () => console.log('Server running on port 3000'));
});
