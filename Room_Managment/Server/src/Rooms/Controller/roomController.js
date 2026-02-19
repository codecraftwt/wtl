const Room = require('../model/roomModel');
const cloudinary = require('../../../utils/cloudinaryConfig');
const { validationResult } = require('express-validator');
const User = require('../../User/model/userModel');


// Create Room
// exports.createRoom = async (req, res) => {
//     try {
//         const { title, description, noOfBeds, roomSize, maxOccupancy, images, pricePerDay, timeForCheckout, ownerId, location } = req.body;

//         const newRoom = new Room({
//             title,
//             description,
//             noOfBeds,
//             roomSize,
//             maxOccupancy,
//             images,
//             pricePerDay,
//             timeForCheckout,
//             ownerId,
//             location,  // Ensure location is passed with 'lat' and 'lng'
//         });

//         await newRoom.save();
//         res.status(201).json({
//             message: "Room created successfully",
//             room: newRoom
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
exports.createRoom = async (req, res) => {
    try {
        const { title, description, noOfBeds, roomSize, maxOccupancy, images, pricePerDay, timeForCheckout, ownerId, location } = req.body;

        // Validate required fields
        if (!title || !description || !noOfBeds || !roomSize || !maxOccupancy || !pricePerDay || !timeForCheckout || !ownerId) {
            return res.status(400).json({ 
                message: 'Missing required fields' 
            });
        }

        // Get owner details (optional - for default location)
        const owner = await User.findById(ownerId);
        
        // Prepare location object
        let roomLocation = {};

        if (location) {
            // Use provided location with the correct structure
            roomLocation = {
                latitude: location.latitude || null,
                longitude: location.longitude || null,
                country: location.country || null,
                state: location.state || null,
                city: location.city || null
            };
        } else if (owner && owner.location) {
            // Use owner's location as default
            roomLocation = {
                latitude: owner.location.latitude || null,
                longitude: owner.location.longitude || null,
                country: owner.location.country || null,
                state: owner.location.state || null,
                city: owner.location.city || null
            };
        }

        const newRoom = new Room({
            title,
            description,
            noOfBeds,
            roomSize,
            maxOccupancy,
            images: images || [],
            pricePerDay,
            timeForCheckout,
            ownerId,
            location: roomLocation,
        });

        await newRoom.save();
        
        // Populate owner details in response
        await newRoom.populate('ownerId', 'name email location');

        res.status(201).json({
            message: "Room created successfully",
            room: newRoom
        });
        
    } catch (err) {
        console.error('Error creating room:', err);
        res.status(500).json({ 
            message: 'Server error',
            error: err.message 
        });
    }
};
// Get Room by ID
exports.getRoomById = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const userId = req.user.id;  // Assuming you're storing the user ID in the token

        // Find the room
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Find bookings for the room by the current user
        const bookings = await Booking.find({ room: roomId, user: userId });

        // Return the room along with filtered bookings
        res.status(200).json({ room, bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Room (except ownerId)
// exports.updateRoom = async (req, res) => {
//     try {
//         const roomId = req.params.roomId;
//         const { title, description, noOfBeds, roomSize, maxOccupancy, images, pricePerDay, timeForCheckout, isAvailable, location } = req.body;

//         const room = await Room.findById(roomId);
//         if (!room) {
//             return res.status(404).json({ message: 'Room not found' });
//         }

//         // Update room fields, including location (lat and lng)
//         room.title = title || room.title;
//         room.description = description || room.description;
//         room.noOfBeds = noOfBeds || room.noOfBeds;
//         room.roomSize = roomSize || room.roomSize;
//         room.maxOccupancy = maxOccupancy || room.maxOccupancy;
//         room.images = images || room.images;
//         room.pricePerDay = pricePerDay || room.pricePerDay;
//         room.timeForCheckout = timeForCheckout || room.timeForCheckout;
//         room.isAvailable = isAvailable === undefined ? room.isAvailable : isAvailable;

//         // If location is provided, update it. Make sure to check if it's valid.
//         if (location) {
//             room.location = {
//                 lat: location.lat || room.location.lat,
//                 lng: location.lng || room.location.lng
//             };
//         }

//         await room.save();

//         res.status(200).json(room);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
exports.updateRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const { title, description, noOfBeds, roomSize, maxOccupancy, images, pricePerDay, timeForCheckout, isAvailable, location } = req.body;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ 
                message: 'Room not found' 
            });
        }

        // Check if user is authorized (owner or admin)
        if (req.user.role !== 'admin' && room.ownerId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ 
                message: 'You are not authorized to update this room' 
            });
        }

        // Update basic fields
        room.title = title || room.title;
        room.description = description || room.description;
        room.noOfBeds = noOfBeds || room.noOfBeds;
        room.roomSize = roomSize || room.roomSize;
        room.maxOccupancy = maxOccupancy || room.maxOccupancy;
        room.images = images || room.images;
        room.pricePerDay = pricePerDay || room.pricePerDay;
        room.timeForCheckout = timeForCheckout || room.timeForCheckout;
        room.isAvailable = isAvailable !== undefined ? isAvailable : room.isAvailable;

        // Update location if provided - with correct structure
        if (location) {
            room.location = {
                latitude: location.latitude !== undefined ? location.latitude : room.location?.latitude,
                longitude: location.longitude !== undefined ? location.longitude : room.location?.longitude,
                country: location.country || room.location?.country,
                state: location.state || room.location?.state,
                city: location.city || room.location?.city
            };
        }

        await room.save();
        
        // Populate owner details
        await room.populate('ownerId', 'name email location');

        res.status(200).json({
            message: "Room updated successfully",
            room
        });
        
    } catch (err) {
        console.error('Error updating room:', err);
        res.status(500).json({ 
            message: 'Server error',
            error: err.message 
        });
    }
};
// Delete Room
exports.deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId;

        const room = await Room.findByIdAndDelete(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle Room Availability
exports.toggleRoomAvailability = async (req, res) => {
    try {
        const roomId = req.params.roomId;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        room.isAvailable = !room.isAvailable;
        await room.save();

        res.status(200).json({
            id: room._id,
            isAvailable: room.isAvailable,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search Rooms with filters (price, location, etc.)
// exports.searchRooms = async (req, res) => {
//   try {
//     // Destructure search parameters from request body
//     const { searchQuery, minPrice, maxPrice, location, maxOccupancy, isAvailable } = req.body;

//     // Build the query object
//     let query = { isAvailable: true }; // Ensure only available rooms are included

//     // Apply filters if they are provided
//     if (minPrice) query.pricePerDay = { $gte: minPrice }; // Filter by minimum price
//     if (maxPrice) query.pricePerDay = { $lte: maxPrice }; // Filter by maximum price
//     if (location) query.location = { $regex: location, $options: 'i' }; // Partial match for location
//     if (maxOccupancy) query.maxOccupancy = { $lte: maxOccupancy }; // Filter by maximum occupancy

//     // If isAvailable is passed as a body parameter, filter accordingly
//     if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true'; // Convert 'true'/'false' to boolean

//     // Add search functionality by room name or description
//     if (searchQuery) {
//       query.$or = [
//         { title: { $regex: searchQuery, $options: 'i' } }, // Match title, case-insensitive
//         { description: { $regex: searchQuery, $options: 'i' } } // Match description, case-insensitive
//       ];
//     }

//     // Find rooms based on the constructed query
//     const rooms = await Room.find(query);

//     // Check if rooms are found
//     if (rooms.length === 0) {
//       return res.status(404).json({ message: 'No available rooms found based on the search criteria.' });
//     }

//     // Return the rooms that match the search criteria
//     res.status(200).json(rooms);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
exports.searchRooms = async (req, res) => {
    try {
        const { searchQuery } = req.body;

        // Get all rooms
        let rooms = await Room.find({}).lean();

        // If search query exists, filter rooms
        if (searchQuery && searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();

            rooms = rooms.filter(room => {
                // Check EVERY field in the room object
                return Object.values(room).some(value => {
                    // Handle null/undefined
                    if (value === null || value === undefined) return false;

                    // Convert value to string and check if includes query
                    return value.toString().toLowerCase().includes(query);
                });
            });
        }

        res.status(200).json({
            success: true,
            count: rooms.length,
            query: searchQuery || 'all',
            data: rooms
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching rooms',
            error: error.message
        });
    }
};

// Image Upload
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload the image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: 'room_images', // Specify folder for better organization
        });

        // Save the image URL to the database and link it to the room
        const room = await Room.findById(req.body.roomId); // Assuming roomId is sent in the body

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Add the uploaded image URL to the images array of the room
        room.images.push(uploadResponse.secure_url);
        await room.save();

        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: uploadResponse.secure_url,
            room,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};




