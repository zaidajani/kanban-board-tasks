const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();


app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log("Please verify the MONGO_URI in your backend/.env file.");
  });

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});