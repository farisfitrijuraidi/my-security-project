const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  testType: {
    type: String,
    required: true, // This will store either 'pre-test' or 'post-test'
  },
  score: {
    type: Number,
    required: true, // Their score out of 9
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically logs the exact time they finished
  },
});

module.exports = mongoose.model("Result", resultSchema);
