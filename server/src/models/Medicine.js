const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: String,
  batch: String,
  expiryDate: Date,
  price: { type: Number, required: true },
  mrp: Number,
  quantity: { type: Number, default: 0 },
  gstPercent: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);
