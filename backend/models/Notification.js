const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // The ID of the customer receiving it
  ticketId: { type: String },               // The specific complaint ID
  formattedID: { type: String },            // e.g., #TC-8822
  title: { type: String, required: true },  // e.g., "Complaint Update: Solved"
  message: { type: String, required: true },// The custom message from Admin
  type: { type: String, default: 'system' },// 'pending', 'review', 'solved', or 'system'
  isUnread: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);