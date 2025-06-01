import express from "express";
import { addProfile, getProfiles } from "../controllers/profileController.js";
const router = express.Router();

router.post("/", addProfile);
router.get("/", getProfiles);

export default router;