const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (The Security Guards)
app.use(cors()); // Allows the frontend to talk to this server
app.use(express.json()); // Allows the server to read JSON data sent by the user

// A basic "Test" route
app.get('/', (req, res) => {
  res.send('YAMU Backend is running! 🚗');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is purring on port ${PORT}`);
});