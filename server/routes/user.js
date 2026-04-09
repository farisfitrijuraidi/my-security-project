const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth"); // Import our new security gate

// SECURE ROUTE: The IDOR Mitigation
router.get("/profile/:id", auth, async (req, res) => {
  try {
    // 1. SECURITY CHECK: Is the logged-in user the owner of this profile?
    // We compare the ID from the token (req.user.id) with the ID in the URL (req.params.id)
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access Denied: You cannot view other students profiles",
      });
    }

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

// VULNERABLE SEARCH: This is the NoSQL Injection "hole"
router.post("/search", async (req, res) => {
  try {
    // The "query" comes from the student's search bar
    const query = req.body.query;

    // This is the mistake: We pass the object directly into the find command!
    const users = await User.find({ username: query }).select("-password");

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
