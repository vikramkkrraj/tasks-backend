
import Book from "../models/Book.js";
import Member from "../models/Member.js";

export const addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const borrowBook = async (req, res) => {
  try {
    const { bookId, memberId } = req.body;
    const book = await Book.findById(bookId);
    if (book.status === "borrowed") return res.status(400).json({ message: "Book not available" });

    const member = await Member.findById(memberId);
    book.status = "borrowed";
    book.borrowers.push(memberId);
    member.borrowedBooks.push(bookId);
    await book.save();
    await member.save();
    res.status(200).json({ book, member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { bookId, memberId } = req.body;
    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);

    book.status = "available";
    book.borrowers = book.borrowers.filter(b => b.toString() !== memberId);
    member.borrowedBooks = member.borrowedBooks.filter(b => b.toString() !== bookId);
    await book.save();
    await member.save();
    res.status(200).json({ book, member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    await Member.updateMany({}, { $pull: { borrowedBooks: book._id } });
    res.status(200).json({ message: "Book deleted and references removed." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookBorrowers = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate("borrowers");
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
