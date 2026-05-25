const socketIO = require('socket.io');
const { Message, Conversation, User } = require('../models');

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Join user room
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`💬 Joined conversation ${conversationId}`);
    });

    // Send message event
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, senderId, content } = data;

        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation) return;

        const recipientId = conversation.participant1Id === senderId ? conversation.participant2Id : conversation.participant1Id;

        const message = await Message.create({
          conversationId,
          senderId,
          recipientId,
          content
        });

        const populatedMessage = await Message.findByPk(message.id, {
          include: [{ model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }]
        });

        // Broadcast to conversation room
        io.to(`conversation_${conversationId}`).emit('receive_message', populatedMessage);
        // Notify recipient
        io.to(`user_${recipientId}`).emit('message_notification', {
          type: 'new_message',
          conversationId,
          message: content
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Typing indicator
    socket.on('user_typing', (data) => {
      const { conversationId, userId } = data;
      io.to(`conversation_${conversationId}`).emit('user_is_typing', { userId });
    });

    socket.on('stop_typing', (data) => {
      const { conversationId, userId } = data;
      io.to(`conversation_${conversationId}`).emit('user_stopped_typing', { userId });
    });

    // Mark message as read
    socket.on('mark_as_read', async (data) => {
      try {
        const { messageId, conversationId } = data;
        const message = await Message.findByPk(messageId);
        if (message) {
          await message.update({ isRead: true, readAt: new Date() });
          io.to(`conversation_${conversationId}`).emit('message_read', { messageId });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initializeSocket };
