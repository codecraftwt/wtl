const mongoose = require('mongoose');
const ActiveBooking = require('../model/activeBookingModel');
const Booking = require('../../Booking/model/bookingModel');
const Room = require('../../Rooms/model/roomModel');
const { updateBooking, createBooking } = require('../../Booking/Controller/bookingController');

// 1. CheckBooking API
exports.checkBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;  // Get bookingId from params

        // Find the active booking by bookingId
        const activeBooking = await ActiveBooking.findOne({ bookingId });

        if (!activeBooking) {
            return res.status(404).json({ message: 'Booking not found in active bookings' });
        }

        // Find the corresponding booking to get the price and other details
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking details not found' });
        }

        // Calculate total hours and days between check-in and check-out
        const checkInDate = new Date(activeBooking.checkIn);
        const checkOutDate = activeBooking.checkOut ? new Date(activeBooking.checkOut) : new Date();
        const totalHours = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600));  // Total hours
        const totalDays = Math.floor(totalHours / 24);  // Total days (rounded down)

        // Get the price per day from the room details
        const room = await Room.findById(booking.roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room details not found' });
        }

        // Calculate the amount
        let amount = 0;

        // If total hours are less than 60 hours, we apply 1 day's price (room.pricePerDay)
        if (totalHours < 60) {
            amount = room.pricePerDay;  // Apply 1 day price if the duration is less than 60 hours
        } else {
            // If total hours are more than 60 hours, calculate the amount based on total hours
            const totalDaysForAmount = totalHours / 24;  // Convert total hours to days
            amount = totalDaysForAmount * room.pricePerDay;
        }

        // If advance is paid, deduct it from the total amount
        if (activeBooking.isAdvancePaid) {
            amount -= activeBooking.advance;
        }

        res.status(200).json({
            message: 'Booking details fetched successfully',
            totalHours,
            totalDays,
            amount,
            advance: activeBooking.advance,
            checkIn: activeBooking.checkIn,
            checkOut: activeBooking.checkOut,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// 2. Scan API
exports.scan = async (req, res) => {
    try {
        const { userId, roomId, bookingStartDate, bookingEndDate, advance, advancemethod, amount, payment_status, payment_method, totalhr } = req.body;

        // Check if room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if room is available
        if (!room.isAvailable) {
            return res.status(400).json({ message: 'Room is not available for booking.' });
        }

        // Calculate total price based on the number of days between bookingStartDate and bookingEndDate
        const startDate = new Date(bookingStartDate);
        const endDate = new Date(bookingEndDate);
        const diffInTime = endDate.getTime() - startDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert time difference to days

        // Amount will remain null when creating the booking
        const bookingAmount = null;

        // Automatically set checkIn to the current time when creating the booking
        const checkIn = new Date();  // Set current time as check-in time
        const checkOut = null; // Leave the check-out time as null for now

        // Set isadvance to true if advance is greater than 0
        const isadvance = advance > 0 ? true : false;

        // Create the booking object
        const newBookingData = {
            roomId,
            ownerId: room.ownerId,  // Automatically get the ownerId from the room
            userId,
            bookingStartDate,
            bookingEndDate,
            amount: bookingAmount, // Set to null initially
            advance,
            advancemethod,
            isadvance,  // Automatically set based on the advance value
            checkIn,  // Automatically set check-in time to current time
            checkOut, // No check-out time at this point
        };

        // Check if the booking already exists in the ActiveBooking collection
        const activeBooking = await ActiveBooking.findOne({ userId, roomId, bookingStartDate, bookingEndDate });

        if (activeBooking) {
            // If booking exists in active bookings, remove it
            await ActiveBooking.findByIdAndRemove(activeBooking._id);  // Remove from active bookings

            // Now, update the existing booking
            const existingBooking = await Booking.findOne({ userId, roomId, bookingStartDate, bookingEndDate });

            if (existingBooking) {
                // If the booking exists, update it
                existingBooking.amount = amount || existingBooking.amount;
                existingBooking.payment_method = payment_method || existingBooking.payment_method;
                existingBooking.checkOut = new Date();  // Automatically set check-out time to current time
                existingBooking.bookingCompleted = true;  // Mark the booking as completed

                // Update room availability
                room.isAvailable = true;  // Mark room as available after the booking is updated
                await room.save();  // Save the room with updated availability

                // Save the updated booking
                await existingBooking.save();

                res.status(200).json({
                    message: 'Booking updated successfully and removed from active bookings.',
                    booking: existingBooking,
                });
            } else {
                return res.status(404).json({ message: 'Booking not found in the system' });
            }
        } else {
            // If the booking doesn't exist in ActiveBooking, create a new entry

            // Create the booking
            const newBooking = new Booking(newBookingData);

            // Save the new booking
            await newBooking.save();

            // Create the new active booking entry
            const newActiveBooking = new ActiveBooking({
                bookingId: newBooking._id,
                userId,
                ownerId: room.ownerId,
                advance,
                isAdvancePaid: isadvance,
                checkIn,
                checkOut: null,
            });
            await newActiveBooking.save();

            // Update room availability to false once booking is created
            room.isAvailable = false; // Set the room as unavailable
            await room.save(); // Save the room with updated availability

            res.status(201).json({
                message: 'Booking created successfully and room availability updated to false.',
                booking: newBooking,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 3. ActiveBookingHistory API
exports.activeBookingHistory = async (req, res) => {
    try {
        const { userId } = req.params;  // Get userId or ownerId from params

        // Find active bookings where either userId or ownerId matches the provided userId
        const activeBookings = await ActiveBooking.find({
            $or: [
                { userId },  // Match bookings where userId matches
                { ownerId: userId }  // Match bookings where ownerId matches
            ]
        });

        if (!activeBookings || activeBookings.length === 0) {
            return res.status(404).json({ message: 'No active bookings found' });
        }

        res.status(200).json({
            message: 'Active booking history fetched successfully',
            activeBookings,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getActiveBookingHistory = async (req, res) => {
    try {
        const { activebookingid } = req.params;  // Get userId or ownerId from params

        // Find active bookings for the given userId or ownerId
        const activeBookings = await ActiveBooking.find({activebookingid})
        //     $or: [
        //         { _id },  // Match bookings where userId matches
        //         { ownerId: userId }  // Match bookings where ownerId matches
        //     ]
        // }).populate('bookingId');  // Populate bookingId field if you want the full booking details.

        if (!activeBookings || activeBookings.length === 0) {
            return res.status(404).json({ message: 'No active bookings found' });
        }

        res.status(200).json({
            message: 'Active booking history fetched successfully',
            activeBookings,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
