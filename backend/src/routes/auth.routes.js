const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const authController = require('../controllers/auth.controller');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateRequest(schemas.register), authController.register);
router.post('/login', validateRequest(schemas.login), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.post('/verify-email/:token', authController.verifyEmail);

module.exports = router;
