const mongoose = require('mongoose');

const receptionSchema = new mongoose.Schema({

  merchant: { type: Number, required: true },
  premier: { type: Number, required: true },
  edahab: { type: Number, required: true },
  "e-besa": { type: Number, required: true },
  others: { type: Number, required: true },
  credit: { type: Number, required: true },
  deposit: { type: Number, required: true },
  refund: { type: Number, required: true },
  discount: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to auto-update `updatedAt` on save
receptionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});



module.exports = mongoose.model('Reception', receptionSchema);
