const express = require('express');
const cors = require('cors');
const complaintRoutes = require('./routes/complaintRoutes'); // 1. Imported here
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Database Connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log("MongoDB database connection established successfully! ✅"))
  .catch(err => console.log("❌ Database connection error: ", err));

// Register Routes
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/complaints', complaintRoutes); // 2. Registered here (Perfect!)

// Test route
app.get('/', (req, res) => {
  res.send('YAMU Backend is live and connected! 🚗');
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// REMOVED the duplicate line that was here