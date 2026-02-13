// const express = require("express");
// const { register, login } = require("../Controller/user.controller");

// const router = express.Router();


// router.post("/reg", register);
// router.post("/log", login);

// module.exports = router;



// src/User/routes/user.route.js
const express = require("express");
const { register, login } = require("../Controller/auth.controller");
const { getAllUsers, getUserById, updateUser, deleteUser, createEmployee, approveSalaryIncrement, submitSalaryIncrementRequest } = require("../Controller/user.controller");
const protect = require("../../../middleware/protect.middleware");
const {
    isAdmin,
    isEmployee,
    canRead,
    canUpdate,
    canDelete,
    canCreateEmployee,
    canViewOwnData,
} = require("../policies/user.policies");

const router = express.Router();

// Public routes for registration and login
router.post("/auth/reg", register);
router.post("/auth/log", login);

// Protected routes for user CRUD operations
router.post("/", protect, isAdmin, createEmployee); // Only admin can view all users
router.get("/", protect, isAdmin, getAllUsers); // Only admin can view all users
// router.get("/:id", protect, canViewOwnData, getUserById); // User can view their own data, admin can view any user's data
router.get("/:id", getUserById); // User can view their own data, admin can view any user's data
router.put("/:id", updateUser); // User can update their own data, admin can update any user
router.delete("/:id", protect, canDelete, deleteUser); // Only admin can delete users


// Admin approves or disapproves salary increment for an employee
router.post("/:id/approve-increment", protect, isAdmin, approveSalaryIncrement);

// Employee submits salary increment request
router.post("/:id/increment-salary", protect, submitSalaryIncrementRequest);


module.exports = router;
