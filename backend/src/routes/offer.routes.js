const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const offerController = require('../controllers/offer.controller');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, validateRequest(schemas.createOffer), offerController.createOffer);
router.get('/land/:landId', offerController.getLandOffers);
router.get('/:id', authMiddleware, offerController.getOfferDetail);
router.put('/:id', authMiddleware, offerController.updateOfferStatus);
router.delete('/:id', authMiddleware, offerController.withdrawOffer);
router.get('/user/sent', authMiddleware, offerController.getSentOffers);
router.get('/user/received', authMiddleware, offerController.getReceivedOffers);

module.exports = router;
