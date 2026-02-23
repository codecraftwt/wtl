const express = require('express');
const router = express.Router();
const {
    createFAQ,
    getMyFAQs,
    getFAQById,
    // markAsViewed,
    getAllFAQs,
    // getFAQStats,
    // changeFAQStatus,
    addAnswerToFAQ,
    adminChangeStatus,
} = require('../Controller/faqController');

// Import only the policies you need (destructured)
const { isUserOrOwner, canViewFAQ, isAdmin } = require('../policies/faqPolicies');
const { protect } = require('../../../middleware/protect.middleware');

// Apply authentication middleware to all routes first
router.use(protect);

// ========== USER & OWNER ROUTES ==========
// Create FAQ (User/Owner only)
router.post('/', isUserOrOwner, createFAQ);

// Get my FAQs (User/Owner)
router.get('/my-faqs', getMyFAQs);

// Get single FAQ (with ownership check)
router.get('/:id', canViewFAQ, getFAQById);


// ========== ADMIN ONLY ROUTES ==========
// Get all FAQs (Admin only)
router.get('/', isAdmin, getAllFAQs);

// Get FAQ stats (Admin only)
// router.get('/stats/all', isAdmin, getFAQStats);

// Change FAQ status (Admin only)
// router.patch('/:id/status', isAdmin, changeFAQStatus);

// Add answer to FAQ (Admin only)
router.post('/:id/answer', isAdmin, addAnswerToFAQ);

router.patch('/status/:id', isAdmin, adminChangeStatus); 

module.exports = router;