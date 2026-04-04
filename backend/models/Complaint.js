const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  // New field: Required to identify which customer to notify
  userId: {
    type: String,
    default: "USER_001" // Default placeholder for existing records
  },
  subject: { 
    type: String, 
    required: true,
    trim: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Vehicle Issue', 'Billing', 'Service', 'Other'] 
  },
  bookingReference: { 
    type: String, 
    required: true,
    trim: true
  },
  priority: { 
    type: String, 
    required: true,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  description: { 
    type: String, 
    required: true 
  },
  attachment: { 
    type: String,
    default: null
  },
  // UPDATED: Matches the labels used in the Admin UI
  status: { 
    type: String, 
    enum: ['Pending', 'Under Review', 'Solved'], 
    default: 'Pending' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Complaint', complaintSchema);