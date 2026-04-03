const Review = require('../models/Review');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { bookingId, vehicleRating, driverRating, overallFeedback } = req.body;

    const newReview = new Review({
      bookingId,
      vehicleRating,
      driverRating,
      overallFeedback
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ message: "Error saving review: " + err.message });
  }
};

// Get all reviews for the Admin
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};