import mongoose from 'mongoose';
const consultationSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  consultedAt: { type: Date, default: Date.now },
  notes: String,
  isActive: { type: Boolean, default: true }
});
export default mongoose.model('Consultation', consultationSchema);
