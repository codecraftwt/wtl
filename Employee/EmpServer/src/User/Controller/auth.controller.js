const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;  

// Register User
exports.register = async (req, res, next) => {
    const { name, mobileNumber, password, role } = req.body;

    try {
        // If the role is provided and it's not 'admin', reject the request
        if (role && role !== 'admin') {
            return res.status(400).json({ message: "Only admin can create users" });
        }

        // Check if the user already exists based on mobile number
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // If role is not provided, default to 'admin'
        const userRole = role || 'admin';

        // Create the new user with the default role as 'admin'
        const user = await User.create({
            name,
            mobileNumber,
            password: hashedPassword,
            role: userRole,
        });

        // Respond with success message
        res.status(201).json({
            message: "User created successfully",
            userId: user._id,
            role: user.role,
        });
    } catch (err) {
        // Handle any server error
        res.status(500).json({ error: err.message });
    }
};
// Login User

exports.login = async (req, res) => {
    const { mobileNumber, password } = req.body;

    try {
        // Find user by mobile number
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare provided password with stored password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT token with userId and role
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

        // Send back the response with user info and token
        res.json({
            token,
            userId: user._id,
            userName: user.name,
            role: user.role,
            mobileNumber: user.mobileNumber
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// In auth.controller.js

// exports.login = async (req, res) => {
//     const { mobileNumber, password } = req.body;

//     try {
//         const user = await User.findOne({ mobileNumber });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

//         res.json({
//             token,
//             userId: user._id,
//             userName: user.name,
//             role: user.role,
//             mobileNumber: user.mobileNumber
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
