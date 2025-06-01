
import express from "express";
import {
  addMember,
  getMemberBorrowedBooks
} from "../controllers/memberController.js";

const router = express.Router();

router.post("/add-member", addMember);
router.get("/member-borrowed-books/:memberId", getMemberBorrowedBooks);

export default router;
