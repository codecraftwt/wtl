// const express = require("express");
// const { createEmployee, getEmployees, updateEmployee, deleteEmployee } = require("../../Emp/Controller/emp.controller");

// const router = express.Router();

// router.post("/", createEmployee);
// router.get("/", getEmployees);
// router.put("/:id", updateEmployee);
// router.delete("/:id", deleteEmployee);

// module.exports = router;

const express = require("express");
const { createEmployee, getEmployees, updateEmployee, deleteEmployee } = require("../../Emp/Controller/emp.controller");
const protect = require("../../../middleware/protect.middleware"); // Protect middleware to verify JWT
const { isAdmin, canRead } = require("../../Emp/policies/emp.policies"); // Role-based policies

const router = express.Router();

// Protect the routes and use role-based policies

// Create employee (only accessible by admin)
router.post("/", protect, isAdmin, createEmployee);

// Get all employees (accessible by both admin and emp)
router.get("/", protect, canRead, getEmployees);

// Update employee (only accessible by admin)
router.put("/:id", protect, isAdmin, updateEmployee);

// Delete employee (only accessible by admin)
router.delete("/:id", protect, isAdmin, deleteEmployee);

module.exports = router;
