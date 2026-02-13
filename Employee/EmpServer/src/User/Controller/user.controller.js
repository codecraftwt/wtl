const User = require("../model/user.model");
const bcrypt = require("bcryptjs");

exports.createEmployee = async (req, res) => {
    const { name, mobileNumber, password } = req.body;
    
    try {
        // Check if the admin is creating a new employee
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only admin can create employees" });
        }

        // Check if the employee already exists
        const existingEmployee = await User.findOne({ mobileNumber });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee already exists" });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new employee (role: 'emp' is default)
        const employee = await User.create({
            name,
            mobileNumber,
            password: hashedPassword,
            role: 'emp' // Default to 'emp' role
        });

        res.status(201).json({
            message: "Employee created successfully",
            userId: employee._id,
            role: employee.role,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Get all users (only admins can do this)
exports.getAllUsers = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admin only" });
    }

    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single user (user can get their own data, admin can get any user data)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Only allow user to access their own data or an admin can access any user data
        // if (req.user.role !== "admin" && req.user._id.toString() !== user._id.toString()) {
        //     return res.status(403).json({ message: "Access denied" });
        // }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Update a user (user can update their own data, admin can update any user)
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Only allow user to update their own data or an admin can update any user data
        // if (req.user.role !== "admin" && req.user._id.toString() !== user._id.toString()) {
        //     return res.status(403).json({ message: "Access denied" });
        // }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a user (only admins can do this)
exports.deleteUser = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admin only" });
    }

    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Admin approves or disapproves salary increment for an employee
exports.approveSalaryIncrement = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the canIncrementSalary flag (true or false)
    user.canIncrementSalary = req.body.canIncrementSalary; // true or false
    await user.save(); // Save the changes

    res.status(200).json({ message: "Salary increment approval status updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Employee submits salary increment request
exports.submitSalaryIncrementRequest = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the employee is allowed to request a salary increment
    if (!user.canIncrementSalary) {
      return res.status(403).json({ message: "You are not authorized to request a salary increment." });
    }

    // Assuming the employee submits the increment amount
    const { incrementAmount } = req.body;
    if (!incrementAmount || incrementAmount <= 0) {
      return res.status(400).json({ message: "Invalid increment amount." });
    }

    // Apply the salary increment
    user.salary += incrementAmount; // Increase the salary
    user.canIncrementSalary = false; // Disable further increments until admin approval again

    await user.save(); // Save the updated user

    res.status(200).json({ message: "Salary increment submitted successfully.", newSalary: user.salary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
