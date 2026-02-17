// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// // Define the user schema
// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ['admin', 'owner', 'user'], default: 'user' },
//     isVerified: { type: Boolean, default: false },
//     isActive: { type: Boolean, default: true },
//     location: {
//       latitude: { type: Number },
//       longitude: { type: Number },
//     },
//   },
//   { timestamps: true }
// );

// // Pre-save middleware to hash password before saving
// userSchema.pre('save', async function () {
//   if (!this.isModified('password')) {
//     return; // Skip hashing if password is not modified
//   }

//   try {
//     const salt = await bcrypt.genSalt(10); // Create salt
//     this.password = await bcrypt.hash(this.password, salt); // Hash password
//   } catch (error) {
//     throw error; // Throw error so it can be handled by the middleware pipeline
//   }
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'owner', 'user'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      country: { type: String },
      state: { type: String },
      city: { type: String }
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; // Skip hashing if password is not modified
  }

  try {
    const salt = await bcrypt.genSalt(10); // Create salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
  } catch (error) {
    throw error; // Throw error so it can be handled by the middleware pipeline
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
