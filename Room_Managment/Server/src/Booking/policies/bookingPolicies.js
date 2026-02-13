exports.allowAllBookings = async (req, res, next) => {
    try {
        // Get the role from the authenticated user (assuming it's in req.user)
        const userRole = req.user.role;

        if (!userRole) {
            return res.status(400).json({ message: 'User role is required' });
        }

        // Check if the role is either 'user' or 'owner', if not return an error
        if (userRole !== 'user' && userRole !== 'owner') {
            return res.status(403).json({ message: 'Access denied. Invalid role' });
        }

        // This policy doesn't filter by user or owner, just proceed to the controller
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error in allowAllBookings' });
    }
};


exports.allowUserAndOwnerBookings = async (req, res, next) => {
    try {
        const userRole = req.user.role;  // Get the role from the authenticated user (assuming it's in req.user)

        if (!userRole) {
            return res.status(400).json({ message: 'User role is required' });
        }

        // If the role is 'user' or 'owner', proceed to the next middleware/controller
        if (userRole === 'user' || userRole === 'owner') {
            return next(); // Proceed to create the booking if role is 'user' or 'owner'
        }

        // If the role is neither 'user' nor 'owner', deny access
        return res.status(403).json({ message: 'Access denied. Only users and owners can create bookings.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error in allowUserAndOwnerBookings' });
    }
};


exports.User = async (req, res, next) => {
    try {
        const userRole = req.user.role;  // Get the role from the authenticated user (assuming it's in req.user)

        if (!userRole) {
            return res.status(400).json({ message: 'User role is required' });
        }

        // If the role is not 'user', deny access
        if (userRole !== 'user') {
            return res.status(403).json({ message: 'Access denied. Only users can access this resource.' });
        }

        // Proceed to the next middleware or controller if the role is 'user'
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error in allowUserOnlyBookings' });
    }
};


exports.Owner = async (req, res, next) => {
    try {
        const userRole = req.user.role;  // Get the role from the authenticated user (assuming it's in req.user)

        if (!userRole) {
            return res.status(400).json({ message: 'User role is required' });
        }

        // If the role is not 'owner', deny access
        if (userRole !== 'owner') {
            return res.status(403).json({ message: 'Access denied. Only owners can access this resource.' });
        }

        // Proceed to the next middleware or controller if the role is 'owner'
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error in allowOwnerOnlyBookings' });
    }
};
