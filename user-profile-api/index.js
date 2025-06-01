import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/add-user", userRoutes);
app.use("/add-profile", profileRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch(err => console.log(err));