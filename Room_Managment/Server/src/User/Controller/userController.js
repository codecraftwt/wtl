const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// 1. Update User (except role, isVerified, email)
// exports.updateUser = async (req, res) => {
//   try {
//     const userId = req.params.userId;  // Get the user ID from URL parameters

//     // Get the data from the request body
//     const { name, password, location } = req.body;

//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update fields except role, isVerified, and email (since those should not be changed)
//     user.name = name || user.name;
//     if (password) {
//       // Hash the new password if provided
//       user.password = await bcrypt.hash(password, 10);
//     }
//     user.location = location || user.location;

//     // Save the updated user
//     await user.save();

//     // Respond with updated user details
//     res.status(200).json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       isVerified: user.isVerified,
//       isActive: user.isActive,
//       location: user.location,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;  // Get the user ID from URL parameters

    // Get the data from the request body
    const { name, password, location } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name if provided
    if (name) user.name = name;

    // Update password if provided - THIS WILL BE HASHED AUTOMATICALLY by pre-save hook
    if (password) {
      user.password = password; // Don't hash here, let pre-save hook handle it
      console.log('Password will be hashed by pre-save hook');
    }

    // Update location if provided (merge with existing location)
    if (location) {
      user.location = {
        ...user.location, // Keep existing values
        ...location       // Override with new values
      };
    }

    // Save the updated user - THIS TRIGGERS THE PRE-SAVE HOOK
    await user.save();

    // Respond with updated user details (excluding password)
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        location: user.location || {},
      }
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// 2. Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;  // Get user ID from URL parameters
    
    // Retrieve the user from the database using the ID from the parameters
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user is found, return the user details
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      location: user.location,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;  // Extract role from params (e.g., "user" or "owner")

    // Check for valid role
    const validRoles = ['user', 'owner'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Query users by role
    const users = await User.find({ role });

    // Return the users filtered by role
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;  // Get user ID from URL parameters

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Activate/Deactivate User
exports.toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.userId;  // Get user ID from URL parameters

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle the user's active status
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      id: user._id,
      isActive: user.isActive,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};




