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
    //     message: "Access Denied: You cannot view other students profiles",
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
    if (typeof query !== "string") {
      return res
        .status(400)
        .json({ message: "Security Alert: Invalid search format. Text only." });
    }

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

module.exports = router;
