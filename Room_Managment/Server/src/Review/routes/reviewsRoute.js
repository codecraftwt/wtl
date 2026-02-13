const express = require('express');
const router = express.Router();
const reviewController = require('../Controller/reviewController');

// Create a review
router.post('/reviews', reviewController.createReview);

// Get all reviews for a specific room
router.get('/reviews/room/:roomId', reviewController.getRoomReviews);

// Get a specific review by its ID
router.get('/reviews/:reviewId', reviewController.getReviewById);

// Update an existing review
router.put('/reviews/:reviewId', reviewController.updateReview);

// Delete a review
router.delete('/reviews/:reviewId', reviewController.deleteReview);

module.exports = router;
