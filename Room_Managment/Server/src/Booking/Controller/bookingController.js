// const Booking = require('../model/bookingModel');
// const Room = require('../../Rooms/model/roomModel');

// exports.createBooking = async (req, res) => {
//     try {
//         const { roomId, bookingStartDate, bookingEndDate, checkIn, checkOut, amount } = req.body;
//         const { userId, ownerId } = req.user; // Assuming user info is available in req.user after JWT authentication

//         // Check if room exists
//         const room = await Room.findById(roomId);
//         if (!room) {
//             return res.status(404).json({ message: 'Room not found' });
//         }

//         // Check if room is available
//         if (!room.isAvailable) {
//             return res.status(400).json({ message: 'Room is not available' });
//         }

//         // Create the booking
//         const booking = new Booking({
//             roomId,
//             ownerId: room.ownerId, // Owner from the room
//             userId,
//             bookingStartDate,
//             bookingEndDate,
//             checkIn,
//             checkOut,
//             amount,
//         });

//         await booking.save();
//         res.status(201).json({
//             message: 'Booking created successfully',
//             booking,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };


// exports.getAllBookings = async (req, res) => {
//     try {
//         const bookings = await Booking.find().populate('roomId').populate('userId').populate('ownerId');
//         res.status(200).json({
//             message: 'All bookings fetched successfully',
//             bookings,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// exports.getBookingById = async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.bookingId)
//             .populate('roomId')
//             .populate('userId')
//             .populate('ownerId');

//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }

//         res.status(200).json({
//             message: 'Booking fetched successfully',
//             booking,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// exports.updateBooking = async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.bookingId);

//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }

//         // Update booking fields (check-out and payment)
//         booking.checkOut = req.body.checkOut || booking.checkOut;
//         booking.payment_status = true; // Assuming payment is done when checking out
//         booking.bookingCompleted = true;

//         await booking.save();

//         res.status(200).json({
//             message: 'Booking updated successfully',
//             booking,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// exports.getBookingsForRoom = async (req, res) => {
//     try {
//         const roomId = req.params.roomId;
//         const bookings = await Booking.find({ roomId }).populate('roomId').populate('userId').populate('ownerId');

//         if (!bookings || bookings.length === 0) {
//             return res.status(404).json({ message: 'No bookings found for this room' });
//         }

//         res.status(200).json({
//             message: 'Bookings fetched successfully',
//             bookings,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// exports.cancelBooking = async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.bookingId);

//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }

//         // Mark the booking as canceled
//         booking.bookingCompleted = false;
//         booking.payment_status = false;

//         await booking.save();

//         res.status(200).json({
//             message: 'Booking canceled successfully',
//             booking,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// exports.getBookingHistory = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming user info is in req.user after authentication
//     const pastBookings = await Booking.find({ userId, bookingCompleted: true }).populate('roomId').populate('userId').populate('ownerId');

//     if (!pastBookings || pastBookings.length === 0) {
//       return res.status(404).json({ message: 'No past bookings found' });
//     }

//     res.status(200).json({
//       message: 'Booking history fetched successfully',
//       bookings: pastBookings,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



const Booking = require('../model/bookingModel');
const Room = require('../../Rooms/model/roomModel');
const ActiveBooking = require('../../ActivBooking/model/activeBookingModel');


//Create Booking
// exports.createBooking = async (req, res) => {
//     try {
//         const { userId, roomId, bookingStartDate, bookingEndDate, advance, advancemethod } = req.body;

//         // Check if room exists
//         const room = await Room.findById(roomId);
//         if (!room) {
//             return res.status(404).json({ message: 'Room not found' });
//         }

//         // Check if room is available
//         if (!room.isAvailable) {
//             return res.status(400).json({ message: 'Room is not available for booking.' });
//         }

//         // Calculate total price based on the number of days between bookingStartDate and bookingEndDate
//         const startDate = new Date(bookingStartDate);
//         const endDate = new Date(bookingEndDate);
//         const diffInTime = endDate.getTime() - startDate.getTime();
//         const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert time difference to days

//         // Amount will remain null when creating the booking
//         const amount = null;

//         // Automatically set checkIn to the current time when creating the booking
//         const checkIn = new Date();  // Set current time as check-in time
//         const checkOut = null; // Leave the check-out time as null for now

//         // Set isadvance to true if advance is greater than 0
//         const isadvance = advance > 0 ? true : false;

//         // Create the booking
//         const booking = new Booking({
//             roomId,
//             ownerId: room.ownerId,  // Automatically get the ownerId from the room
//             userId,
//             bookingStartDate,
//             bookingEndDate,
//             amount, // Set to null initially
//             advance,
//             advancemethod,
//             isadvance,  // Automatically set based on the advance value
//             checkIn,  // Automatically set check-in time to current time
//             checkOut, // No check-out time at this point
//         });

//         // Save the booking
//         await booking.save();

//         // Update room availability to false once booking is created
//         room.isAvailable = false; // Set the room as unavailable
//         await room.save(); // Save the room with updated availability

//         res.status(201).json({
//             message: 'Booking created successfully, and room availability updated to false.',
//             booking,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
exports.createBooking = async (req, res) => {
    try {
        const { userId, roomId, bookingStartDate, bookingEndDate, advance, advancemethod } = req.body;

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
        const amount = null;

        // Automatically set checkIn to the current time when creating the booking
        const checkIn = new Date();  // Set current time as check-in time
        const checkOut = null; // Leave the check-out time as null for now

        // Set isadvance to true if advance is greater than 0
        const isadvance = advance > 0 ? true : false;

        // Create the booking
        const booking = new Booking({
            roomId,
            ownerId: room.ownerId,  // Automatically get the ownerId from the room
            userId,
            bookingStartDate,
            bookingEndDate,
            amount, // Set to null initially
            advance,
            advancemethod,
            isadvance,  // Automatically set based on the advance value
            checkIn,  // Automatically set check-in time to current time
            checkOut, // No check-out time at this point
        });

        // Save the booking
        await booking.save();

        // Create the ActiveBooking entry
        const activeBooking = new ActiveBooking({
            bookingId: booking._id,  // Reference to the created booking
            userId,                  // User who made the booking
            ownerId: room.ownerId,   // Owner of the room
            advance,                 // Advance paid by the user
            isAdvancePaid: isadvance, // Set to true if advance is paid
            checkIn,                 // Set to current time as check-in
            checkOut: null,          // Set to null initially
        });

        // Save the ActiveBooking
        await activeBooking.save();

        // Update room availability to false once booking is created
        room.isAvailable = false; // Set the room as unavailable
        await room.save(); // Save the room with updated availability

        res.status(201).json({
            message: 'Booking created successfully, and room availability updated to false.',
            booking,
            activeBooking, // Return the active booking as well
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

//Get Booking
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('roomId')
            .populate('userId')
            .populate('ownerId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({
            message: 'Booking fetched successfully',
            booking,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

//Pdate CheckOut
// exports.updateBooking = async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.bookingId);

//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }

//         // Get the amount and payment_method from the request body
//         const { amount, payment_status, payment_method } = req.body;

//         // Automatically set check-out time to current time
//         booking.checkOut = new Date();

//         // Update the amount if provided, else keep the existing amount
//         booking.amount = amount || booking.amount;

//         // Set payment status to true (indicating that payment has been completed)
//         booking.payment_status = payment_status !== undefined ? payment_status : true;

//         // Mark the booking as completed
//         booking.bookingCompleted = true;

//         // Update room availability to false (room is no longer available after booking)
//         const room = await Room.findById(booking.roomId);
//         if (room) {
//             room.isAvailable = true;
//             await room.save();
//         } else {
//             return res.status(404).json({ message: 'Room not found' });
//         }

//         // Save the updated booking
//         await booking.save();

//         res.status(200).json({
//             message: 'Booking updated successfully',
//             booking,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
exports.updateBooking = async (req, res) => {
    try {
        // Find the booking by bookingId
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Get the amount and payment details from the request body
        const { amount, payment_status, payment_method } = req.body;

        // Automatically set check-out time to current time
        booking.checkOut = new Date();

        // Update the amount if provided, else keep the existing amount
        booking.amount = amount || booking.amount;

        // Set payment status to true (indicating that payment has been completed)
        booking.payment_status = payment_status !== undefined ? payment_status : true;

        // Mark the booking as completed
        booking.bookingCompleted = true;

        // Update room availability to true (room is no longer available after booking completion)
        const room = await Room.findById(booking.roomId);
        if (room) {
            room.isAvailable = true;
            await room.save();
        } else {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Remove the corresponding ActiveBooking entry
        const activeBooking = await ActiveBooking.findOne({ bookingId: booking._id });
        if (activeBooking) {
            await ActiveBooking.findByIdAndDelete(activeBooking._id);  // Use findByIdAndDelete instead of findByIdAndRemove
        } else {
            console.log('No active booking found for this booking');
        }

        // Save the updated booking
        await booking.save();

        res.status(200).json({
            message: 'Booking updated successfully, and active booking removed.',
            booking,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


//Get From Room Id
exports.getBookingsForRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const bookings = await Booking.find({ roomId })
            .populate('roomId')
            .populate('userId')
            .populate('ownerId');

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this room' });
        }

        res.status(200).json({
            message: 'Bookings fetched successfully',
            bookings,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// exports.getBookingsForRoom = async (req, res) => {
//     try {
//         const { roomId } = req.params;  // Get roomId from params
//         const { userId, ownerId } = req.query;  // Get userId and ownerId from query params

//         // Build the query object dynamically
//         const query = { roomId };

//         // Use $or if both userId or ownerId is passed to match either of them
//         if (userId || ownerId) {
//             query.$or = [];  // Initialize the $or array

//             if (userId) {
//                 query.$or.push({ userId });  // Match bookings where userId matches
//             }

//             if (ownerId) {
//                 query.$or.push({ ownerId });  // Match bookings where ownerId matches
//             }
//         }

//         // Find the first booking based on the dynamic query
//         const booking = await Booking.findOne(query)
//             .populate('roomId')
//             .populate('userId')
//             .populate('ownerId');

//         if (!booking) {
//             return res.status(404).json({ message: 'No booking found for this room or user/owner' });
//         }

//         res.status(200).json({
//             message: 'Booking fetched successfully',
//             booking,  // Return the single booking
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };






//Cancele Booking

// exports.cancelBooking = async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.bookingId);

//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }

//         // Set the booking as canceled
//         booking.bookingCompleted = true;
//         booking.payment_status = false;
//         booking.isbookingcancel = true;  // Use the correct field name 'isbookingcancel'

//         // Get the associated room and set its availability to true
//         const room = await Room.findById(booking.roomId);
//         if (room) {
//             room.isAvailable = true;  // Mark the room as available again
//             await room.save();  // Save the updated room status
//         }

//         // Save the booking status with isbookingcancel set to true
//         await booking.save();

//         res.status(200).json({
//             message: 'Booking canceled successfully',
//             booking,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // If already cancelled
        if (booking.isbookingcancel) {
            return res.status(400).json({
                message: 'Booking already cancelled'
            });
        }

        // 1️⃣ Update Booking Status
        booking.bookingCompleted = true;
        booking.payment_status = false;
        booking.isbookingcancel = true;

        await booking.save();

        // 2️⃣ Make Room Available Again
        const room = await Room.findById(booking.roomId);
        if (room) {
            room.isAvailable = true;
            await room.save();
        }

        // 3️⃣ Delete From ActiveBooking Collection
        await ActiveBooking.findOneAndDelete({ bookingId: bookingId });

        res.status(200).json({
            message: 'Booking cancelled successfully and removed from active bookings',
            booking
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

//History
exports.getBookingHistory = async (req, res) => {
    try {
        const { userId } = req.params;  // Get userId from params
        
        // Initialize query object
        let query = {};

        // Check if userId matches the userId or ownerId in the database
        query = {
            $or: [
                { userId }, // Match bookings where userId matches
                { ownerId: userId } // Match bookings where ownerId matches
            ],
            bookingCompleted: true // Only fetch completed bookings
        };

        // Fetch bookings that match the query
        const pastBookings = await Booking.find(query)
            .populate('roomId')
            .populate('userId')
            .populate('ownerId');

        if (!pastBookings || pastBookings.length === 0) {
            return res.status(404).json({ message: 'No past bookings found' });
        }

        res.status(200).json({
            message: 'Booking history fetched successfully',
            bookings: pastBookings,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



