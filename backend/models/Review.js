const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  vehicleRating: { type: Number, required: true, min: 1, max: 5 },
  driverRating: { type: Number, required: true, min: 1, max: 5 },
  overallFeedback: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);