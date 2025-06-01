
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  author: { type: String, required: true },
  status: { type: String, enum: ["available", "borrowed"], default: "available" },
  borrowers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Book", bookSchema);
