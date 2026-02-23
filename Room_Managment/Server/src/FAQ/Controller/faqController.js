const FAQ = require('../model/faqModel');
const User = require('../../User/model/userModel');

// ========== CREATE FAQ (User & Owner) ==========
exports.createFAQ = async (req, res) => {
    try {
        const { question, category } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a question'
            });
        }

        // Check if user is authorized to create (user or owner)
        if (req.user.role !== 'user' && req.user.role !== 'owner') {
            return res.status(403).json({
                success: false,
                message: 'Only users and owners can create FAQs'
            });
        }

        const newFAQ = new FAQ({
            uderId: req.user.id,
            name: req.user.name,
            role: req.user.role,
            question,
            category: category || 'general',
            status: 'unseen'  
        });

        await newFAQ.save();

        res.status(201).json({
            success: true,
            message: '✅ FAQ created successfully',
            data: newFAQ
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating FAQ',
            error: error.message
        });
    }
};

// ========== GET USER'S OWN FAQs (User & Owner) ==========
exports.getMyFAQs = async (req, res) => {
    try {
        const faq = await FAQ.find({ uderId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: faq.length,
            data: faq
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching your FAQs',
            error: error.message
        });
    }
};

// ========== GET SINGLE FAQ ==========
exports.getFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id)
            .populate('uderId', 'name email role');

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found'
            });
        }

        // Check access: Admin can view any, others can only view their own
        if (req.user.role !== 'admin' && faq.uderId._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only view your own FAQs.'
            });
        }

        // If user/owner views their own FAQ and status is 'unseen', update to 'view'
        if (req.user.role !== 'admin' && faq.status === 'unseen') {
            faq.status = 'view';
            await faq.save();
        }

        res.status(200).json({
            success: true,
            data: faq
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching FAQ',
            error: error.message
        });
    }
};

// ========== GET ALL FAQs (Admin only) ==========
exports.getAllFAQs = async (req, res) => {
    try {
        const { status, role, category } = req.query;
        let filter = {};

        // Only add filters if they are provided
        if (status) filter.status = status;
        if (role) filter.role = role;
        if (category) filter.category = category;

        // If no filters provided, filter = {} (empty) = ALL documents
        const faqs = await FAQ.find(filter)
            .populate('uderId', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: faqs.length,
            data: faqs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching FAQs',
            error: error.message
        });
    }
};


// ========== ADMIN: ADD ANSWER TO FAQ ==========
exports.addAnswerToFAQ = async (req, res) => {
    try {
        const { answer } = req.body;

        if (!answer) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an answer'
            });
        }

        const faq = await FAQ.findByIdAndUpdate(
            req.params.id,
            { 
                answer,
                status: 'completed'  // Auto-complete when answered
            },
            { new: true }
        ).populate('uderId', 'name email role');

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found'
            });
        }

        res.status(200).json({
            success: true,
            message: '✅ Answer added to FAQ',
            data: faq
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding answer',
            error: error.message
        });
    }
};

// ========== ADMIN: CHANGE ANY FAQ STATUS ==========
exports.adminChangeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['unseen', 'view', 'pending', 'completed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid status. Allowed: unseen, view, pending, completed'
            });
        }

        const faq = await FAQ.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('uderId', 'name email role');

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `✅ FAQ status changed to ${status} by admin`,
            data: faq
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error changing FAQ status',
            error: error.message
        });
    }
};

