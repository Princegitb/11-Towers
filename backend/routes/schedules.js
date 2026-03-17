const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const jwt = require('jsonwebtoken');

// Reuse auth middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret1234');
      req.user = decoded;
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

// @route   GET /api/schedules
// @desc    Get all active schedules (Public / Resident)
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find({ status: 'active' }).sort({ startTime: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/schedules
// @desc    Create a schedule (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, type, startTime, endTime } = req.body;
    const schedule = new Schedule({
      title,
      description,
      type,
      startTime,
      endTime,
      createdBy: req.user.id
    });
    const createdSchedule = await schedule.save();
    res.status(201).json(createdSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/schedules/:id
// @desc    Delete a schedule (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    await schedule.deleteOne();
    res.json({ message: 'Schedule removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
