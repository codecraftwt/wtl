// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     mobileNumber: { type: String, required: true, unique: true },
//     password: { type: String, required: true, unique: true },
//     role: { 
//         type: String, 
//         enum: ['admin', 'emp'],
//         default: 'emp'          
//     }

    
// });
// // userSchema.pre('save', async function(next) {
// //     if (this.isModified('password')) { // Check if the password is being modified
// //         this.password = await bcrypt.hash(this.password, 10); // Hash password with salt rounds of 10
// //     }
// //     next(); // Continue with the save operation
// // });

// module.exports = mongoose.model("User", userSchema);





const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'emp'],
        default: 'emp'
    },
    salary: { type: Number, default: 0 },
  canIncrementSalary: { type: Boolean, default: false }
});

// Hash password before saving user
// userSchema.pre('save', async function(next) {
//     if (this.isModified('password')) { // Only hash password if it's modified
//         this.password = await bcrypt.hash(this.password, 10); // Hash password
//     }
//     next();
// });

module.exports = mongoose.model("User", userSchema);
