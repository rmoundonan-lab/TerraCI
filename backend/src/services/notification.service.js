const { Notification } = require('../models');

const createNotification = async (userId, type, title, message, relatedId = null, relatedType = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId,
      relatedType
    });
    return { success: true, data: notification };
  } catch (error) {
    console.error('Notification creation failed:', error);
    return { success: false, error: error.message };
  }
};

const notifyNewOffer = async (sellerId, offerId, price) => {
  return createNotification(
    sellerId,
    'new_offer',
    'Nouvelle offre',
    `Vous avez reçu une offre de ${price} XOF`,
    offerId,
    'offer'
  );
};

const notifyOfferResponse = async (buyerId, offerId, status) => {
  const statusText = status === 'accepted' ? 'acceptée' : 'rejetée';
  return createNotification(
    buyerId,
    `offer_${status}`,
    `Offre ${statusText}`,
    `Votre offre a été ${statusText}`,
    offerId,
    'offer'
  );
};

const notifyNewMessage = async (userId, conversationId) => {
  return createNotification(
    userId,
    'new_message',
    'Nouveau message',
    'Vous avez reçu un nouveau message',
    conversationId,
    'conversation'
  );
};

const notifyLandVerified = async (userId, landId) => {
  return createNotification(
    userId,
    'land_verified',
    'Terrain vérifié',
    'Votre terrain a été vérifié',
    landId,
    'land'
  );
};

const notifyReviewReceived = async (userId, reviewId) => {
  return createNotification(
    userId,
    'review_received',
    'Nouvel avis',
    'Vous avez reçu un nouvel avis',
    reviewId,
    'review'
  );
};

module.exports = {
  createNotification,
  notifyNewOffer,
  notifyOfferResponse,
  notifyNewMessage,
  notifyLandVerified,
  notifyReviewReceived
};
