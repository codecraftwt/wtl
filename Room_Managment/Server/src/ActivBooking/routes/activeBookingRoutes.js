const express = require('express');
const router = express.Router();
const { checkBooking, scan, activeBookingHistory, getActiveBookingHistory } = require('../Controller/activeBookingController');

// Route for checking booking details
router.get('/check/:bookingId', checkBooking);

// Route for scanning and processing booking
router.post('/scan', scan);

// Route for getting active booking history
router.get('/history/:userId', activeBookingHistory);
router.get('/get/:userId', getActiveBookingHistory);

module.exports = router;
