const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const favoriteController = require('../controllers/favorite.controller');

const router = express.Router();

// Protected routes
router.post('/:landId', authMiddleware, favoriteController.addFavorite);
router.delete('/:landId', authMiddleware, favoriteController.removeFavorite);
router.get('/', authMiddleware, favoriteController.getFavorites);
router.get('/:landId/is-favorite', authMiddleware, favoriteController.isFavorite);

module.exports = router;
