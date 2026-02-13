const express = require('express');
const router = express.Router();

const {
  createBooking,
//   getAllBookings,
  getBookingById,
  updateBooking,
  getBookingsForRoom,
  cancelBooking,
  getBookingHistory,
} = require('../Controller/bookingController');

const {allowUserAndOwnerBookings,allowUserOnlyBookings}=require('../policies/bookingPolicies')

// POST - Create a Booking (Check-in)
router.post('/create', createBooking);

// GET - Get all Bookings
// router.get('/', getAllBookings);

// GET - Get Booking by ID
router.get('/:bookingId', getBookingById);

// PUT - Update Booking (Check-out)
router.put('/checkout/:bookingId', updateBooking);

// GET - Get Bookings for a Room
router.get('/room/:roomId', getBookingsForRoom);

// PUT - Cancel Booking
router.put('/cancel/:bookingId', cancelBooking);

// GET - Get Booking History (Past Bookings)
router.get('/history/:userId', getBookingHistory);

module.exports = router;
