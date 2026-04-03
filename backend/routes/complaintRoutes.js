const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// @route   POST api/complaints
// @desc    Submit a new complaint
router.post('/', async (req, res) => {
  try {
    const { subject, category, bookingReference, priority, description, attachment } = req.body;

    const newComplaint = new Complaint({
      subject,
      category,
      bookingReference,
      priority,
      description,
      attachment // For now, this will be a string/URL
    });

    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (err) {
    console.error("Error saving complaint:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/complaints
// @desc    Get all complaints for the Admin table
router.get('/', async (req, res) => {
  try {
    // We sort by 'createdAt' so newest tickets appear at the top (-1)
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/complaints/:id
// @desc    Update complaint status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedComplaint);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;