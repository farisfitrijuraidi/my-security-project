const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// --- REGISTRATION ROUTE ---
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "Student registered successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// --- LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if the user exists in your MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 2. Compare the typed password with the hashed password in the database
    // Bcrypt takes the plain password, hashes it again, and checks if it matches the stored version.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 3. Create the "Security Pass" (JWT)
    // The payload is the data we store inside the token, such as the user's unique ID and role.
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // We sign the token using a secret key from your .env file
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // The pass expires in one hour for better security
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
