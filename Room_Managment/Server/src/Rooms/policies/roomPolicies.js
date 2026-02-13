// 1. Middleware to check if the user is the Owner
exports.isOwner = (req, res, next) => {
  // Check if the user ID matches the ownerId of the resource
  if (req.user.role === 'owner' ) {
    return next(); // Allow the request to proceed if the user is the owner
  }
  return res.status(403).json({ message: 'Access denied. Only the owner can access this resource.' });
};


// 2. Middleware to check if the user is either Admin or Owner
exports.isOwnerOrAdmin = (req, res, next) => {
  // Check if the user is an admin or the owner
  if (req.user.role === 'admin' ||req.user.role === 'owner'){
    return next(); // Allow the request to proceed if the user is Admin or Owner
  }
  return res.status(403).json({ message: 'Access denied. Only Admin or Owner can access this resource.' });
};


// 3. Middleware to check if the user is Admin, Owner, or User
exports.isAdminOrOwnerOrUser = (req, res, next) => {
  // Check if the user is an admin, owner, or user
  if (req.user.role === 'admin' || req.user.role === 'owner' || req.user.role === 'user') {
    return next(); // Allow the request to proceed if the user is Admin, Owner, or User
  }
  return res.status(403).json({ message: 'Access denied. Only Admin, Owner, or User can access this resource.' });
};
