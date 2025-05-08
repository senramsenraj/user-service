// filepath: backend/db.js
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_USER_SERVICE);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;