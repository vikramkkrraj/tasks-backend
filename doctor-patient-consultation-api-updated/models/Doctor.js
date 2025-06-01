import mongoose from 'mongoose';
const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  isActive: { type: Boolean, default: true }
});
export default mongoose.model('Doctor', doctorSchema);
