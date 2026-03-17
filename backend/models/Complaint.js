const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Plumbing', 'Electrical', 'Security', 'Cleaning', 'Other'] },
  status: { type: String, default: 'Pending', enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'] },
  tower: { type: String },
  flatNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
