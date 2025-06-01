
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
});

export default mongoose.model("Member", memberSchema);
