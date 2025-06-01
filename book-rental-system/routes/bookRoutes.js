import express from "express";
import {
  addBook,
  getBookRenters,
  rentBook,
  returnBook
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/add-book", addBook);
router.get("/book-renters/:bookId", getBookRenters);
router.post("/rent-book", rentBook);
router.post("/return-book", returnBook);

export default router;