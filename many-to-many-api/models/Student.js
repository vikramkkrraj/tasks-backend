import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    isActive: { type: Boolean, default: true }
});

export default mongoose.model('Student', studentSchema);