const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables
const express = require('express');
const cors = require('cors');
const { loginUser, signupUser } = require('./routes/auth');

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.set('bufferCommands', false);

async function connectToDatabase() {
  try {
    // No need for useNewUrlParser and useUnifiedTopology anymore in Mongoose 6 and beyond
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit the application if MongoDB connection fails
  }
}

// Initialize connection before setting up the routes
connectToDatabase().then(() => {
  // Login Route
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await loginUser(email, password);
      res.status(result.status).json({ message: result.message, user: result.user });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error during login' });
    }
  });

  // Signup Route
  app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const result = await signupUser(name, email, password);
      res.status(result.status).json({ message: result.message, user: result.user });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Server error during signup' });
    }
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
