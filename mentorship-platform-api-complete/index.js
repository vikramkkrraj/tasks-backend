import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mentorRoutes from './routes/mentorRoutes.js';
import learnerRoutes from './routes/learnerRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/mentors', mentorRoutes);
app.use('/learners', learnerRoutes);
app.use('/sessions', sessionRoutes);

mongoose.connect(process.env.MONGO_URL, () => {
  console.log('MongoDB connected');
  app.listen(8080, () => console.log('Server running on port 8080'));
});