import Book from "../models/Book.js";
import User from "../models/User.js";

export const addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBookRenters = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate("rentedBy");
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book.rentedBy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rentBook = async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    if (!user || !book) return res.status(404).json({ message: "User or Book not found" });

    if (!user.rentedBooks.includes(bookId)) user.rentedBooks.push(bookId);
    if (!book.rentedBy.includes(userId)) book.rentedBy.push(userId);

    await user.save();
    await book.save();
    res.json({ message: "Book rented successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const returnBook = async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    await User.findByIdAndUpdate(userId, { $pull: { rentedBooks: bookId } });
    await Book.findByIdAndUpdate(bookId, { $pull: { rentedBy: userId } });
    res.json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};