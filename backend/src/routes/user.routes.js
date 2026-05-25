const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const userController = require('../controllers/user.controller');
const multer = require('multer');

const router = express.Router();

// Configure multer for avatar upload
const upload = multer({ dest: 'uploads/avatars/' });

// Protected routes
router.get('/me', authMiddleware, userController.getProfile);
router.put('/me', authMiddleware, upload.single('avatar'), userController.updateProfile);
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserProfile);
router.get('/:id/lands', userController.getUserLands);
router.get('/:id/reviews', userController.getUserReviews);

module.exports = router;
