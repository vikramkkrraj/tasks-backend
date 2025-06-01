import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  joinedAt: Date,
});
export default mongoose.model('User', userSchema);
