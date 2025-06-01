import express from "express";
import { addPatient, deletePatient, getPatientDoctors, getMalePatients } from "../controllers/patientController.js";
const router = express.Router();
router.post("/", addPatient);
router.delete("/:id", deletePatient);
router.get("/:id/doctors", getPatientDoctors);
router.get("/", getMalePatients);
export default router;
