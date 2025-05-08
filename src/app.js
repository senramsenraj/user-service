const express = require('express');
const connectDB = require('./db')
const cors = require("cors");
const authRoutes = require('../routes/auth')

const app = express();
connectDB()

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:8081', // Allow requests from the frontend
    credentials: true, // Allow credentials (if needed)
  })
);

// Handle preflight requests
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    res.send('User Service is running!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`);
});
