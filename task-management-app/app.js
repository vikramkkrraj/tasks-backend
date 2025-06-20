const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require("./utils/logger");

dotenv.config();
const app = express();

app.use(express.json());
app.use(logger);

app.use("/api/auth", require('./routes/authRoutes'));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/admin", require('./routes/adminRoutes'));

module.exports = app;
