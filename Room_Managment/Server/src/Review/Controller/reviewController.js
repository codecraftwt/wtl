const Review = require('../../Review/model/reviewModel'); // Assuming your model is located here
const Room = require('../../Rooms/model/roomModel'); // Assuming Room model is here
const User = require('../../User/model/userModel'); // Assuming User model is here

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const { roomId, userId, rating, comment } = req.body;

        // Check if the room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new review
        const review = new Review({
            roomId,
            userId,
            rating,
            comment,
        });

        // Save the review
        await review.save();

        res.status(201).json({
            message: 'Review created successfully',
            review,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all reviews for a specific room
exports.getRoomReviews = async (req, res) => {
    try {
        const { roomId } = req.params;

        // Get reviews for the room
        const reviews = await Review.find({ roomId }).populate('userId', 'name');

        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this room' });
        }

        res.status(200).json({
            message: 'Reviews fetched successfully',
            reviews,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific review by its ID
exports.getReviewById = async (req, res) => {
    try {
        const { reviewId } = req.params;

        // Find the review by ID
        const review = await Review.findById(reviewId).populate('userId', 'name');

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({
            message: 'Review fetched successfully',
            review,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an existing review
exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        // Find the review by ID
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Update the review details
        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        // Save the updated review
        await review.save();

        res.status(200).json({
            message: 'Review updated successfully',
            review,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        // Find and delete the review by ID
        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({
            message: 'Review deleted successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
