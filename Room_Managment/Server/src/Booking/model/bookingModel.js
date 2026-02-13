const mongoose = require('mongoose');
const Room = require('../../Rooms/model/roomModel');
const User = require('../../User/model/userModel');

const bookingSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingStartDate: { type: Date, required: true },
    bookingEndDate: { type: Date, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, },
    payment_method: { type: String, enum: ['cash', 'upi'] },
    payment_status: { type: Boolean, default: false },
    advance: { type: Number, default: 0 },
    isadvance: { type: Boolean, default: false },
    advance_method: { type: String, enum: ['cash', 'upi'] },
    amount: { type: Number },
    bookingCompleted: { type: Boolean, default: false },
    totalhr: { type: Number },
    priceperday: { type: Number, ref: Room },
    isbookingcancel: { type: Boolean, default: false }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
