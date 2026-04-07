require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware: These are tools that help the server handle data.
// CORS allows your React frontend to talk to this backend.
app.use(cors());
// This allows the server to read JSON data sent in a request.
app.use(express.json());

// The Connection Logic: Connecting your server to the MongoDB Atlas cloud.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ SUCCESS: Connected to MongoDB Atlas!"))
  .catch((err) =>
    console.error("❌ ERROR: Could not connect to MongoDB:", err),
  );

// Basic Route: Just to show the server is alive.
app.get("/", (req, res) => {
  res.send("API is Running...");
});

// Part 2: The API Test Route.
// We use this to confirm the frontend can reach the backend correctly.
app.get("/api/test", (req, res) => {
  res.json({
    status: "Success",
    message: "Backend API is officially reachable!",
    timestamp: new Date(),
  });
});

// Start the server on Port 5000.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
