const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB without the deprecated options
    await mongoose.connect(process.env.DB_URI);

    console.log("MongoDB Connected...!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
