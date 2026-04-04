const Complaint = require('../models/Complaint');

// @desc    Submit a new complaint
exports.createComplaint = async (req, res) => {
  try {
    const newComplaint = new Complaint(req.body);
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get all complaints for Admin Dispute Table
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update a complaint status (Admin Action)
// Fixes Mongoose warning by using returnDocument: 'after'
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true } 
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint record not found" });
    }

    res.json(updatedComplaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};