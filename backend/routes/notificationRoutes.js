const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// @route   POST api/notifications
// @desc    Create a new notification (Sent by Admin)
router.post('/', async (req, res) => {
  try {
    const newNotif = new Notification(req.body);
    const savedNotif = await newNotif.save();
    res.status(201).json(savedNotif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET api/notifications
// @desc    Get all notifications (For Customer Dashboard)
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PATCH api/notifications/:id
// @desc    Mark notification as read
router.patch('/:id', async (req, res) => {
  try {
    const updatedNotif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isUnread: false },
      { returnDocument: 'after' }
    );
    res.json(updatedNotif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;