const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const reviewController = require('../controllers/review.controller');

const router = express.Router();

// Protected routes
router.post('/:userId', authMiddleware, reviewController.createReview);
router.get('/user/:userId', reviewController.getUserReviews);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);
router.get('/:userId/average', reviewController.getAverageRating);

module.exports = router;
