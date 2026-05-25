const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

// Protected routes
router.get('/', authMiddleware, notificationController.getNotifications);
router.get('/unread', authMiddleware, notificationController.getUnreadCount);
router.put('/:id/read', authMiddleware, notificationController.markAsRead);
router.put('/read-all', authMiddleware, notificationController.markAllAsRead);
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

module.exports = router;
