const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['PayPal', 'Stripe'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  transactionId: { type: String, required: true },
  advance: { type: Number, default: 0 },
  advanceMethod: { type: String, enum: ['credit', 'debit', 'cash'], default: 'credit' }, 
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
