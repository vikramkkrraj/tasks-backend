import express from "express";
import { addConsultation, getRecentConsultations } from "../controllers/consultationController.js";
const router = express.Router();
router.post("/", addConsultation);
router.get("/recent", getRecentConsultations);
export default router;
