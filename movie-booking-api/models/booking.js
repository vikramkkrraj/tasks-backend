import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  movieId: String,
  bookingDate: Date,
  seats: Number,
  status: String,
});
export default mongoose.model('Booking', bookingSchema);
