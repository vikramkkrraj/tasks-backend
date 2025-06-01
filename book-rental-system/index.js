import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/book_rental");

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

app.listen(3000, () => console.log("Server started on port 3000"));