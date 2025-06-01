import mongoose from 'mongoose';
const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  isActive: { type: Boolean, default: true }
});
export default mongoose.model('Patient', patientSchema);
