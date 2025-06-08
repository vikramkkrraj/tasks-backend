const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(express.json());
app.use("/api", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server running at port " + process.env.PORT);
    });
  })
  .catch(err => console.log(err));
