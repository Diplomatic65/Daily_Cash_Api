const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  waiter: { type: String, required: true },
  merchant: { type: Number, required: true },
  premier: { type: Number, required: true },
  edahab: { type: Number, required: true },
  "e-besa": { type: Number, required: true },
  others: { type: Number, required: true },
  credit: { type: Number, required: true },
  promotion: { type: Number, required: true },
  open: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to auto-update `updatedAt` on save
transactionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
