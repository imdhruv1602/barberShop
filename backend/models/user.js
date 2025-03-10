const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name is required
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']  // Email format validation
  },
  password: { type: String, required: true },  // Password is required
});

// Create User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
