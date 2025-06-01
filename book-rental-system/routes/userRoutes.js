import express from "express";
import { addUser, getUserRentals } from "../controllers/userController.js";
const router = express.Router();

router.post("/add-user", addUser);
router.get("/user-rentals/:userId", getUserRentals);

export default router;