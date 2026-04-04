const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// @route   POST api/complaints
// @desc    Submit a new complaint
router.post('/', complaintController.createComplaint);

// @route   GET api/complaints
// @desc    Get all complaints for the Admin table
router.get('/', complaintController.getComplaints);

// @route   PATCH api/complaints/:id
// @desc    Update complaint status (Admin Action)
router.patch('/:id', complaintController.updateComplaintStatus);

module.exports = router;