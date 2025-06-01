import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  rentedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
});

export default mongoose.model("User", userSchema);