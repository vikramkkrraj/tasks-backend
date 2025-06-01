import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    bio: { type: String },
    socialMediaLinks: [String],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }
});

export default mongoose.model("Profile", profileSchema);