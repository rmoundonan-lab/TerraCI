const { Offer, Land, User, Notification, Sequelize } = require('../models');

// Create offer
const createOffer = async (req, res) => {
  try {
    const { landId, offeredPrice, message } = req.validatedData;

    const land = await Land.findByPk(landId);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    const offer = await Offer.create({
      landId,
      buyerId: req.user.id,
      sellerId: land.userId,
      offeredPrice,
      message
    });

    // Create notification for seller
    await Notification.create({
      userId: land.userId,
      type: 'new_offer',
      title: 'Nouvelle offre reçue',
      message: `Une nouvelle offre de ${offeredPrice} XOF a été reçue`,
      relatedId: offer.id,
      relatedType: 'offer'
    });

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create offer', error: error.message });
  }
};

// Get land offers
const getLandOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll({
      where: { landId: req.params.landId, status: 'pending' },
      include: [{ model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }]
    });

    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch offers' });
  }
};

// Get offer detail
const getOfferDetail = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id, {
      include: [
        { model: Land, as: 'land' },
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

    if (offer.buyerId !== req.user.id && offer.sellerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch offer' });
  }
};

// Update offer status
const updateOfferStatus = async (req, res) => {
  try {
    const { status, respondedMessage } = req.body;
    const offer = await Offer.findByPk(req.params.id);

    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

    if (offer.sellerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only seller can respond' });
    }

    offer.status = status;
    offer.respondedAt = new Date();
    if (respondedMessage) offer.respondedMessage = respondedMessage;
    await offer.save();

    // Create notification for buyer
    const statusText = status === 'accepted' ? 'acceptée' : 'rejetée';
    await Notification.create({
      userId: offer.buyerId,
      type: `offer_${status}`,
      title: `Offre ${statusText}`,
      message: `Votre offre a été ${statusText}`,
      relatedId: offer.id,
      relatedType: 'offer'
    });

    res.json({ success: true, message: 'Offer updated successfully', data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update offer' });
  }
};

// Withdraw offer
const withdrawOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

    if (offer.buyerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await offer.destroy();
    res.json({ success: true, message: 'Offer withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to withdraw offer' });
  }
};

// Get sent offers
const getSentOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll({
      where: { buyerId: req.user.id },
      include: [{ model: Land, as: 'land', include: [{ model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName'] }] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch sent offers' });
  }
};

// Get received offers
const getReceivedOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll({
      where: { sellerId: req.user.id },
      include: [
        { model: Land, as: 'land' },
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch received offers' });
  }
};

module.exports = {
  createOffer,
  getLandOffers,
  getOfferDetail,
  updateOfferStatus,
  withdrawOffer,
  getSentOffers,
  getReceivedOffers
};
