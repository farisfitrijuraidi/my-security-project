const Result = require("../models/Result");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth"); // Import our new security gate

// SECURE ROUTE: The IDOR Mitigation
router.get("/profile/:id", auth, async (req, res) => {
  try {
    // 1. SECURITY CHECK: Is the logged-in user the owner of this profile?
    // We compare the ID from the token (req.user.id) with the ID in the URL (req.params.id)
    // if (req.user.id !== req.params.id && req.user.role !== "admin") {
    //   return res.status(403).json({
    //     message: "Access Denied: You cannot view other profiles",
    //   });
    // }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// SECURE SEARCH: The NoSQL Injection Mitigation
router.post("/search", async (req, res) => {
  try {
    const query = req.body.query;

    // THE FIX: Type Validation
    // We check if the input is strictly a text string. If it is an object, we block it.
    // if (typeof query !== "string") {
    //   return res
    //     .status(400)
    //     .json({ message: "Security Alert: Invalid search format. Text only." });
    // }

    const users = await User.find({ username: query }).select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// VULNERABLE ROUTE: Stored XSS endpoint
router.put("/bio", auth, async (req, res) => {
  try {
    // We grab the text exactly as the user typed it
    const newBio = req.body.bio;

    // We find the logged-in user by their token ID and update their bio
    // The '{ new: true }' part just tells MongoDB to send back the updated data
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio: newBio },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// The Comprehensive Database Reset Route
router.post("/reset-labs", async (req, res) => {
  try {
    // 1. Reset Admin Alice specifically
    await User.updateOne(
      { username: "admin_alice" },
      {
        bio: "Platform Administrator. Please email me directly for system access issues or role upgrades.",
      },
    );

    // 2. Mass Reset all standard participants at once!
    // This finds everyone with the 'student' role, except Bob, and wipes their bio clean.
    await User.updateMany(
      { role: "student", username: { $ne: "hacker_bob" } },
      { bio: "Hello, I am a new student!" },
    );

    res.json({ message: "Entire lab environment successfully reset." });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({ message: "Failed to reset labs" });
  }
});

// The Test Submission Route
router.post("/submit-test", async (req, res) => {
  try {
    // Grab the data sent from the React frontend
    const { username, testType, score } = req.body;

    // Create a new database entry using our blueprint
    const newResult = new Result({
      username: username,
      testType: testType,
      score: score,
    });

    // Save it to MongoDB
    await newResult.save();

    // Tell the frontend it was a success
    res
      .status(201)
      .json({ message: "Test score successfully saved to database." });
  } catch (error) {
    console.error("Error saving test result:", error);
    res.status(500).json({ message: "Failed to save test data" });
  }
});

module.exports = router;
