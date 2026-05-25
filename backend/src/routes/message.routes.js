const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const messageController = require('../controllers/message.controller');

const router = express.Router();

// Protected routes
router.get('/conversations', authMiddleware, messageController.getConversations);
router.get('/conversations/:conversationId', authMiddleware, messageController.getConversationMessages);
router.post('/', authMiddleware, messageController.sendMessage);
router.put('/:id/read', authMiddleware, messageController.markAsRead);
router.get('/search', authMiddleware, messageController.searchMessages);

module.exports = router;
