const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'student'
  },
  // We are adding the new bio field right here
  bio: {
    type: String,
    default: 'Hello, I am a new student!'
  }
});

module.exports = mongoose.model('user', UserSchema);