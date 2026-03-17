const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret1234');
      req.user = decoded; // Contains id and role
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// @route   POST /api/complaints
// @desc    Create a complaint (Resident)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, tower, flatNumber } = req.body;
    const complaint = new Complaint({
      user: req.user.id,
      title,
      description,
      category,
      tower,
      flatNumber
    });
    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/complaints
// @desc    Get all complaints (Admin gets all, Resident gets their own)
router.get('/', protect, async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'admin') {
      complaints = await Complaint.find().populate('user', 'name email tower flatNumber');
    } else {
      complaints = await Complaint.find({ user: req.user.id });
    }
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status (Admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = status;
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
