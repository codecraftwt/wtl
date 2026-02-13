const protect = require("../../../middleware/protect.middleware"); 
const jwt = require('jsonwebtoken');
const User = require("../../User/model/user.model");  
// Check if the user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Only admin can perform this action" });
  }
  next();
};

// Check if the user is emp (user role) 
const isUser = (req, res, next) => {
  if (req.user.role !== "emp") {
    return res.status(403).json({ message: "Forbidden: Only user can perform this action" });
  }
  next();
};

// Check if the user is admin or emp (for read access)
const canRead = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "emp") {
    return res.status(403).json({ message: "Forbidden: Only admin or emp can perform this action" });
  }
  next();
};

module.exports = { isAdmin, isUser, canRead };

