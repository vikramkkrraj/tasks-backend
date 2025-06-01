import mongoose from 'mongoose';

const learnerSchema = new mongoose.Schema({
  name: String,
  email: String,
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Learner', learnerSchema);