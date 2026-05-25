const { Favorite, Land, LandImage } = require('../models');

// Add favorite
const addFavorite = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.landId);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    const favorite = await Favorite.create({
      userId: req.user.id,
      landId: req.params.landId
    });

    res.status(201).json({ success: true, message: 'Added to favorites', data: favorite });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'Already in favorites' });
    }
    res.status(500).json({ success: false, message: 'Failed to add favorite' });
  }
};

// Remove favorite
const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, landId: req.params.landId }
    });

    if (!favorite) return res.status(404).json({ success: false, message: 'Favorite not found' });

    await favorite.destroy();
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove favorite' });
  }
};

// Get favorites
const getFavorites = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Favorite.findAndCountAll({
      where: { userId: req.user.id },
      include: [{ model: Land, as: 'land', include: [{ model: LandImage, as: 'images', limit: 1 }] }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count, pages: Math.ceil(count / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch favorites' });
  }
};

// Is favorite
const isFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, landId: req.params.landId }
    });

    res.json({ success: true, data: { isFavorite: !!favorite } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check favorite status' });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite
};
