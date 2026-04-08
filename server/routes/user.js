const express = require("express");
const router = express.Router();
const User = require("../models/User");

// VULNERABLE ROUTE: This is the IDOR "hole"
// It takes an ID from the URL and returns that user's data without any permission checks.
router.get("/profile/:id", async (req, res) => {
  try {
    // We find the user by the ID provided in the web address (URL)
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // This is the mistake: We just send the data back to whoever asked for it!
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
