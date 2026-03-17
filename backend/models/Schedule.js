const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['water', 'maintenance', 'other'], default: 'water' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
