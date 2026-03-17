const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: String, default: 'medium', enum: ['small', 'medium', 'large'] },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
