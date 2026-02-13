// Policy to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};

// Policy to check if the user is an employee (emp)
const isEmployee = (req, res, next) => {
    if (req.user.role !== "emp") {
        return res.status(403).json({ message: "Access denied: Employees only" });
    }
    next();
};

// Policy to allow users to read (both admins and employees)
const canRead = (req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "emp") {
        return res.status(403).json({ message: "Access denied: Only admin or employee can read" });
    }
    next();
};

// Policy to check if the user can update their own data or if the user is an admin
const canUpdate = (req, res, next) => {
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Access denied: Only admin can update others' data" });
    }
    next();
};

// Policy to check if the user can delete (admins only)
const canDelete = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};

// Policy to check if the user can create a new employee (only admins)
const canCreateEmployee = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Only admins can create employees" });
    }
    next();
};

// Policy to allow both admin and emp to view their own data
const canViewOwnData = (req, res, next) => {
    if (req.user.role === "emp" && req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Access denied: You can only view your own data" });
    }
    next();
};

module.exports = {
    isAdmin,
    isEmployee,
    canRead,
    canUpdate,
    canDelete,
    canCreateEmployee,
    canViewOwnData,
};
