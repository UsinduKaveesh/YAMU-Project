const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookingId: { 
    type: String, 
    required: true 
  },
  // Added to support the names shown in your UI screenshot
  passengerName: { 
    type: String, 
    required: true,
    default: "Guest User" 
  },
  driverName: { 
    type: String, 
    required: true 
  },
  vehicleType: { 
    type: String, 
    required: true // e.g., "Tesla Model 3" or "Honda Accord"
  },
  vehicleRating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  driverRating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  overallFeedback: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], // Matches your capitalization
    default: 'Pending' 
  }
}, { 
  // This automatically adds 'createdAt' and 'updatedAt' fields
  timestamps: true 
});

module.exports = mongoose.model('Review', reviewSchema);