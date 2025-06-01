import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);
app.use("/consultations", consultationRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => app.listen(8080, () => console.log("Server running")))
    .catch((err) => console.log(err));
