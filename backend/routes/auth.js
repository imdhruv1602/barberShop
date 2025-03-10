const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Function to handle user login
async function loginUser(email, password) {
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return { message: 'User not found', status: 404 };
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { message: 'Invalid password', status: 400 };
    }

    // Return success message or user details after successful login
    return { message: 'Login successful', status: 200, user };
  } catch (error) {
    console.log('Error in login:', error);
    return { message: 'Server error during login', status: 500 };
  }
}

// Function to handle user signup
async function signupUser(name, email, password) {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: 'User already exists', status: 400 };
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    return { message: 'User created successfully', status: 201, user: newUser };
  } catch (error) {
    console.log('Error in signup:', error);
    return { message: 'Server error during signup', status: 500 };
  }
}

module.exports = { loginUser, signupUser };
