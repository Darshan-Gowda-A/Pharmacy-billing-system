// server/src/models/Sale.js
const mongoose = require('mongoose');

const SaleItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
  name: String,
  qty: Number,
  price: Number,
  gstPercent: Number,
  subtotal: Number
});

const SaleSchema = new mongoose.Schema({
  items: [SaleItemSchema],
  total: Number,
  tax: Number,
  grandTotal: Number,
  discount: { type: Number, default: 0 },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false } // the user who created the sale
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);
