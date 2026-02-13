const bcrypt = require('bcryptjs');
const User = require('../../User/model/userModel');  
const { generateToken } = require('../../../utils/jwt');  

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user object (password will be hashed in the pre-save middleware)
    const user = new User({
      name,
      email,
      password,  // The password will be hashed in the pre-save middleware
      role,
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token for the user
    const token = generateToken(user._id, user.role);

    // Send the response with the user info and token
    res.status(201).json({
      token,
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Login User and return a JWT token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user);

  res.status(200).json({
    token,
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
};

module.exports = { registerUser, loginUser };
