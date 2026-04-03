const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
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
  // This will store the filename or URL of the uploaded attachment
  attachment: { 
    type: String,
    default: null
  },
  // Admin-only field to track the lifecycle of the dispute
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved'], 
    default: 'Open' 
  }
}, { 
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt'
});

module.exports = mongoose.model('Complaint', complaintSchema);