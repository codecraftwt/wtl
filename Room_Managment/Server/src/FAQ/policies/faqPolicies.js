// ========== ADMIN ONLY POLICY ==========
exports.isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role === 'admin') {
            return next();
        }
        
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Policy check failed',
            error: error.message
        });
    }
};

// ========== USER OR OWNER ONLY POLICY ==========
exports.isUserOrOwner = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role === 'user' || req.user.role === 'owner') {
            return next();
        }
        
        return res.status(403).json({
            success: false,
            message: 'Access denied. Only users and owners can perform this action.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Policy check failed',
            error: error.message
        });
    }
};

// ========== OWNERSHIP CHECK POLICY ==========
exports.isOwnerOfFAQ = (req, res, next) => {
    try {
        const FAQ = require('../model/faqModel');
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Admin can bypass ownership check
        if (req.user.role === 'admin') {
            return next();
        }

        FAQ.findById(req.params.id)
            .then(faq => {
                if (!faq) {
                    return res.status(404).json({
                        success: false,
                        message: 'FAQ not found'
                    });
                }

                // Check if user owns this FAQ
                if (faq.uderId.toString() === req.user.id) {
                    return next();
                }

                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only access your own FAQs.'
                });
            })
            .catch(error => {
                return res.status(500).json({
                    success: false,
                    message: 'Policy check failed',
                    error: error.message
                });
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Policy check failed',
            error: error.message
        });
    }
};

// ========== CAN VIEW FAQ POLICY ==========
exports.canViewFAQ = (req, res, next) => {
    try {
        const FAQ = require('../model/faqModel');
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Admin can view any
        if (req.user.role === 'admin') {
            return next();
        }

        FAQ.findById(req.params.id)
            .then(faq => {
                if (!faq) {
                    return res.status(404).json({
                        success: false,
                        message: 'FAQ not found'
                    });
                }

                // Check if user owns this FAQ
                if (faq.uderId.toString() === req.user.id) {
                    return next();
                }

                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only view your own FAQs.'
                });
            })
            .catch(error => {
                return res.status(500).json({
                    success: false,
                    message: 'Policy check failed',
                    error: error.message
                });
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Policy check failed',
            error: error.message
        });
    }
};