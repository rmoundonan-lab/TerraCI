const { Review, User, Land } = require('../models');

// Create review
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { userId } = req.params;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      reviewerId: req.user.id,
      reviewedUserId: userId,
      rating,
      comment
    });

    res.status(201).json({ success: true, message: 'Review created', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create review', error: error.message });
  }
};

// Get user reviews
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { reviewedUserId: req.params.userId },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findByPk(req.params.id);

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.reviewerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();

    res.json({ success: true, message: 'Review updated', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.reviewerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await review.destroy();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};

// Get average rating
const getAverageRating = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { reviewedUserId: req.params.userId },
      attributes: ['rating']
    });

    const average = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

    res.json({ success: true, data: { average, count: reviews.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to calculate average rating' });
  }
};

module.exports = {
  createReview,
  getUserReviews,
  updateReview,
  deleteReview,
  getAverageRating
};
