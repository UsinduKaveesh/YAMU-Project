const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Ensure the path to your model is correct

// 1. CREATE: Submit a new review (Used by the Passenger Form)
router.post('/', async (req, res) => {
  const { 
    bookingId, 
    passengerName, 
    driverName, 
    vehicleType, 
    vehicleRating, 
    driverRating, 
    overallFeedback 
  } = req.body;

  try {
    const newReview = new Review({
      bookingId,
      passengerName,
      driverName,
      vehicleType,
      vehicleRating,
      driverRating,
      overallFeedback,
      status: 'Pending' // Explicitly set starting status
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ message: "Error saving review: " + err.message });
  }
});

// 2. READ: Get all reviews (Used by the Admin Approval Screen)
router.get('/', async (req, res) => {
  try {
    // .sort({ createdAt: -1 }) ensures the newest reviews appear at the top
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews: " + err.message });
  }
});

// 3. UPDATE: Change Review Status (Used by Approve/Reject buttons)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    // Check if the status is one of our allowed Enum values
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true } // Returns the modified document rather than the original
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: "Update failed: " + err.message });
  }
});

module.exports = router;