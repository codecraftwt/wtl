// // Middleware to check if the user is an Admin
// exports.isAdmin = (req, res, next) => {
//   if (req.user.role === 'admin') {
//     return next(); // Allow the request to proceed if the user is an admin
//   }
//   return res.status(403).json({ message: 'Access denied. Admins only.' });
// };

// // Middleware to check if the user is either Admin, Owner, or User (for specific access)
// exports.isUserOrOwner = (req, res, next) => {
//   if (req.user.role === 'admin' || req.user.role === 'owner' || req.user.role === 'user') {
//     return next(); // Allow the request to proceed if the user is Admin, Owner, or User
//   }
//   return res.status(403).json({ message: 'Access denied. Only Admin, Owner, or User can access.' });
// };

// // Middleware to check if the user is either Admin or Owner (for update or toggle status)
// exports.isAdminOrOwner = (req, res, next) => {
//   if (req.user.role === 'admin' || req.user.role === 'owner') {
//     return next(); // Allow the request to proceed if the user is Admin or Owner
//   }
//   return res.status(403).json({ message: 'Access denied. Only Admin or Owner can access.' });
// };

// // Middleware to check if the user is either Admin or User (for getting user details)
// exports.isAdminOrUser = (req, res, next) => {
//   if (req.user.role === 'admin' || req.user.role === 'user') {
//     return next(); // Allow the request to proceed if the user is Admin or User
//   }
//   return res.status(403).json({ message: 'Access denied. Only Admin or User can access.' });
// };


// Middleware to check if the user is an Admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();  // Allow the request to proceed if the user is an admin
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
};


// Middleware to check if the user is an Admin, Owner, or User (allow all)
exports.isAdminOrOwnerOrUser = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'owner' || req.user.role === 'user')) {
        return next();  // Allow the request to proceed if the user is Admin, Owner, or User
    }
    return res.status(403).json({ message: 'Access denied. Only Admin, Owner, or User can access.' });
};
