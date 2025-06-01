
import express from "express";
import {
  addBook,
  borrowBook,
  returnBook,
  updateBook,
  deleteBook,
  getBookBorrowers
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/add-book", addBook);
router.post("/borrow-book", borrowBook);
router.post("/return-book", returnBook);
router.put("/update-book/:bookId", updateBook);
router.delete("/delete-book/:bookId", deleteBook);
router.get("/book-borrowers/:bookId", getBookBorrowers);

export default router;
