const { Message, Conversation, User, Sequelize } = require('../models');

// Get conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        [Sequelize.Op.or]: [
          { participant1Id: req.user.id },
          { participant2Id: req.user.id }
        ]
      },
      include: [
        { model: User, as: 'participant1', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
        { model: User, as: 'participant2', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
      ],
      order: [['lastMessageAt', 'DESC']]
    });

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
};

// Get conversation messages
const getConversationMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const conversation = await Conversation.findByPk(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (conversation.participant1Id !== req.user.id && conversation.participant2Id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { count, rows } = await Message.findAndCountAll({
      where: { conversationId: req.params.conversationId },
      include: [{ model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows.reverse(),
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (conversation.participant1Id !== req.user.id && conversation.participant2Id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const recipientId = conversation.participant1Id === req.user.id ? conversation.participant2Id : conversation.participant1Id;

    const message = await Message.create({
      conversationId,
      senderId: req.user.id,
      recipientId,
      content
    });

    await conversation.update({
      lastMessageAt: new Date(),
      lastMessage: content
    });

    const populatedMessage = await Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }]
    });

    res.status(201).json({ success: true, message: 'Message sent', data: populatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
};

// Mark as read
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    if (message.recipientId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await message.update({ isRead: true, readAt: new Date() });
    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark message as read' });
  }
};

// Search messages
const searchMessages = async (req, res) => {
  try {
    const { q } = req.query;
    const messages = await Message.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: req.user.id },
          { recipientId: req.user.id }
        ],
        content: { [Sequelize.Op.iLike]: `%${q}%` }
      },
      limit: 20
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search messages' });
  }
};

module.exports = {
  getConversations,
  getConversationMessages,
  sendMessage,
  markAsRead,
  searchMessages
};
