import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
  topic: String,
  time: Date,
  notes: String,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Learner' }],
  feedback: String,
  status: { type: String, default: 'active' },
  isArchived: { type: Boolean, default: false }
});

export default mongoose.model('Session', sessionSchema);