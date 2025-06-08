const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  author: String,
  publishedYear: Number,
});

module.exports = mongoose.model('Book', bookSchema);
