const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  position: { type: String, required: true },
  salary: Number
}, { timestamps: true }); 
module.exports = mongoose.model("Employee", employeeSchema);
