
const express = require('express');
// const { protect } = require('../../../middleware/protect.middleware');  // Protect middleware to validate JWT
const { updateUser, getUserById, getAllUsers, deleteUser, toggleUserStatus, getUsersByRole, updateProfilePhoto } = require('../Controller/userController');
// const { isAdmin, isUserOrOwner, isAdminOrOwner, isAdminOrUser } = require('../policies/userPolicies'); 
const { isAdmin, isAdminOrOwnerOrUser } = require('../policies/userPolicies');
const multer = require('multer');
const router = express.Router();
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

router.put('/update/profile-photo/:userId', upload.single('profilePhoto'), updateProfilePhoto);

// 1. Update user by ID --------------- Allow for All (admin, owner, user)
router.put('/update/:userId', updateUser);

// 2. Get user by ID --------------- Allow for All (admin, owner, user)
router.get('/:userId', getUserById);

// 3. Get all users --------------- Allow only for Admin
router.get('/', isAdmin, getAllUsers);

// 4. Delete user by ID --------------- Allow only for Admin
router.delete('/:userId', deleteUser);

// 5. Activate/Deactivate user by ID --------------- Allow for All (admin, owner, user)
router.put('/status/:userId', toggleUserStatus);

// getall users
router.get('/role/:role', getUsersByRole);


module.exports = router;
