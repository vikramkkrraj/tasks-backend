import express from "express";
import { addDoctor, deleteDoctor, getDoctorPatients, getDoctorConsultationCount } from "../controllers/doctorController.js";
const router = express.Router();
router.post("/", addDoctor);
router.delete("/:id", deleteDoctor);
router.get("/:id/patients", getDoctorPatients);
router.get("/:id/consultations/count", getDoctorConsultationCount);
export default router;
