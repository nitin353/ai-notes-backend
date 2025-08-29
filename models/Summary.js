const mongoose = require('mongoose');
const SummarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalText: { type: String },
  summaryText: { type: String },
  title: { type: String },
  sourceFile: { type: String }, // file path if uploaded
  length: { type: String }, // short/medium/long
}, { timestamps: true });
module.exports = mongoose.model('Summary', SummarySchema);