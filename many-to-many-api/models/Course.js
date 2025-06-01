import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    isActive: { type: Boolean, default: true }
});

export default mongoose.model('Course', courseSchema);