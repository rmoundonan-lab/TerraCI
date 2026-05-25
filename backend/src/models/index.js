const sequelize = require('../config/database');
const User = require('./User');
const Land = require('./Land');
const LandImage = require('./LandImage');
const LandDocument = require('./LandDocument');
const Offer = require('./Offer');
const Favorite = require('./Favorite');
const Conversation = require('./Conversation');
const Message = require('./Message');
const Notification = require('./Notification');
const Review = require('./Review');
const Report = require('./Report');

// User associations
User.hasMany(Land, { foreignKey: 'userId', as: 'lands' });
User.hasMany(Offer, { foreignKey: 'buyerId', as: 'purchaseOffers' });
User.hasMany(Offer, { foreignKey: 'sellerId', as: 'salesOffers' });
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages' });
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'reviews' });
User.hasMany(Review, { foreignKey: 'reviewedUserId', as: 'receivedReviews' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

// Land associations
Land.belongsTo(User, { foreignKey: 'userId', as: 'seller' });
Land.hasMany(LandImage, { foreignKey: 'landId', as: 'images', onDelete: 'CASCADE' });
Land.hasMany(LandDocument, { foreignKey: 'landId', as: 'documents', onDelete: 'CASCADE' });
Land.hasMany(Offer, { foreignKey: 'landId', as: 'offers', onDelete: 'CASCADE' });
Land.hasMany(Favorite, { foreignKey: 'landId', as: 'favoritedBy', onDelete: 'CASCADE' });

// Offer associations
Offer.belongsTo(Land, { foreignKey: 'landId', as: 'land' });
Offer.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
Offer.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// Favorite associations
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Favorite.belongsTo(Land, { foreignKey: 'landId', as: 'land' });

// LandImage associations
LandImage.belongsTo(Land, { foreignKey: 'landId', as: 'land' });

// LandDocument associations
LandDocument.belongsTo(Land, { foreignKey: 'landId', as: 'land' });

// Conversation associations
Conversation.belongsTo(User, { foreignKey: 'participant1Id', as: 'participant1' });
Conversation.belongsTo(User, { foreignKey: 'participant2Id', as: 'participant2' });
Conversation.belongsTo(Land, { foreignKey: 'landId', as: 'land' });
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE' });

// Message associations
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Review associations
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewedUserId', as: 'reviewedUser' });
Review.belongsTo(Land, { foreignKey: 'landId', as: 'land' });

// Report associations
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
Report.belongsTo(User, { foreignKey: 'reportedUserId', as: 'reportedUser' });
Report.belongsTo(Land, { foreignKey: 'reportedLandId', as: 'reportedLand' });

module.exports = {
  sequelize,
  User,
  Land,
  LandImage,
  LandDocument,
  Offer,
  Favorite,
  Conversation,
  Message,
  Notification,
  Review,
  Report
};
