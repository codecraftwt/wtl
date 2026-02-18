const express = require('express');
const { protect } = require('../../../middleware/protect.middleware'); // Protect middleware
const {
  createRoom,
  getRoomById,
  getAllRooms,
  updateRoom,
  deleteRoom,
  toggleRoomAvailability,
  searchRooms,
  uploadImage
} = require('../Controller/roomController');
const { isOwner, isOwnerOrAdmin, isAdminOrOwnerOrUser } = require('../policies/roomPolicies');
const multer = require('multer');  
// Set up multer storage (you can customize it to save the image locally or directly to cloudinary)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory to save the image
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Create a unique filename by appending a timestamp
  }
});

// Initialize multer with the defined storage configuration
const upload = multer({ storage: storage });

const router = express.Router();

// router.use(protect);

// Create Room
router.post('/', protect, createRoom);

router.post('/upload-image',protect, upload.single('image'), uploadImage);

// Get Room by ID
router.get('/:roomId', getRoomById);

// Get All Rooms
router.get('/', getAllRooms);

// Update Room
router.put('/:roomId',protect, isOwnerOrAdmin, updateRoom);

// Delete Room
router.delete('/:roomId', protect,isOwnerOrAdmin, deleteRoom);

// Toggle Room Availability
router.put('/:roomId/availability', protect, toggleRoomAvailability);

// Search Rooms (with filters)
router.post('/search', isAdminOrOwnerOrUser,protect, searchRooms);

module.exports = router;
