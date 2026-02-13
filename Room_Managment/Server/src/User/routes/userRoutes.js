// const express = require('express');
// const { protect } = require('../../../middleware/protect.middleware');  // Protect middleware to validate JWT
// const { updateUser, getUserById, getAllUsers, deleteUser, toggleUserStatus } = require('../Controller/userController');
// const { isAdmin, isUserOrOwner, isAdminOrOwner, isAdminOrUser } = require('../policies/userPolicies'); 
// const router = express.Router();
// // Update user by ID (except role, isVerified, email)
// router.put('/update/:userId', updateUser);

// // Get user by ID
// router.get('/:userId', getUserById);

// // Get all users
// router.get('/', getAllUsers);

// // Delete user by ID
// router.delete('/:userId', deleteUser);

// // Activate/Deactivate user by ID
// router.put('/status/:userId', toggleUserStatus);

// module.exports = router;



const express = require('express');
// const { protect } = require('../../../middleware/protect.middleware');  // Protect middleware to validate JWT
const { updateUser, getUserById, getAllUsers, deleteUser, toggleUserStatus,  getUsersByRole } = require('../Controller/userController');
// const { isAdmin, isUserOrOwner, isAdminOrOwner, isAdminOrUser } = require('../policies/userPolicies'); 
const { isAdmin, isAdminOrOwnerOrUser } = require('../policies/userPolicies');

const router = express.Router();

// router.use(protect);

// 1. Update user by ID --------------- Allow for All (admin, owner, user)
router.put('/update/:userId', updateUser);

// 2. Get user by ID --------------- Allow for All (admin, owner, user)
router.get('/:userId', getUserById);

// 3. Get all users --------------- Allow only for Admin
router.get('/', isAdmin, getAllUsers);

// 4. Delete user by ID --------------- Allow only for Admin
router.delete('/:userId', isAdmin, deleteUser);

// 5. Activate/Deactivate user by ID --------------- Allow for All (admin, owner, user)
router.put('/status/:userId', toggleUserStatus);

// getall users
router.get('/role/:role',  getUsersByRole);


module.exports = router;
