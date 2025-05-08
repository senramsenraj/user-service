// filepath: backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// Registration Endpoint
router.post("/register", async (req, res) => {
  const { name, email, password ,location} = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      location
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Return the users as JSON
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, email: user.email });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// Fetch user by email
router.get("/user-by-email", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});


// Get user details by ID
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});


module.exports = router;