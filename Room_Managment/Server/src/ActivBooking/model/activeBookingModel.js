const mongoose = require('mongoose');

const activeBookingSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  advance: { type: Number},
  isAdvancePaid: { type: Boolean, default: false },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
}, { timestamps: true });

const ActiveBooking = mongoose.model('ActiveBooking', activeBookingSchema);

module.exports = ActiveBooking;
