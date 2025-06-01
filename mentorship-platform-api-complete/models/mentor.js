import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Mentor', mentorSchema);